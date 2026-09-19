import { NextRequest, NextResponse } from "next/server";

// Proxies natural-language questions to the deployed EC2/llama.cpp
// text-to-SQL generation endpoint. This exists so the endpoint URL and any
// auth token never reach the client bundle, and so a cheap, honest layer of
// abuse protection sits in front of a CPU inference box that costs real
// money per request and is turned off overnight.
//
// GENERATION_ENDPOINT_URL must be set in the deployment environment (e.g.
// Vercel project settings) once the FastAPI proxy's exact contract is
// confirmed. Until it is set, this route always reports "offline" — which
// is accurate, since there is currently nothing to call.
//
// Known limitation: the per-IP / daily counters below live in a plain
// in-memory Map. On Vercel's serverless runtime that memory is not shared
// across instances and resets on cold start, so this is a soft limit — it
// stops casual repeat clicking, not a determined script. If this demo sees
// meaningful traffic, replace ipBuckets/dailyCount with a durable store
// (Vercel KV / Upstash Redis) behind the same checkRateLimit interface.

const MAX_QUESTION_LENGTH = 240;
const PER_IP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const PER_IP_MAX_REQUESTS = 6;
const DAILY_MAX_REQUESTS = 200;
const UPSTREAM_TIMEOUT_MS = 20_000; // real inference is ~12s on CPU; leave headroom

// Confirmed against the live OpenAPI spec (GET /openapi.json on the EC2 endpoint):
// POST /generate expects { question: string (1-2000 chars), schema: string (1-8000 chars) }
// and returns { sql: string, latency_ms: number, request_id: string }.
//
// This demo is locked to one fixed database (world geography), so the schema text is a
// server-side constant, not something the client can influence. Pulled verbatim via
// `SELECT sql FROM sqlite_master WHERE type='table'` against the same database used by
// the SQL sandbox's case q2 (also q1, q8) -- real DDL, not reconstructed from queries.
// `province` and `mountain` are referenced by foreign key but intentionally left out of
// this schema text: none of the demo's reference questions join through them, and the
// columns visitors are likely to ask about (country/city/org names, independence dates,
// mountain names) are already present on the tables below.
const DEMO_SCHEMA = `CREATE TABLE "country"
(
    Name       TEXT            not null
        constraint ix_county_Name
            unique,
    Code       TEXT default '' not null
        primary key,
    Capital    TEXT,
    Province   TEXT,
    Area       REAL,
    Population INTEGER
)

CREATE TABLE "city"
(
    Name       TEXT default '' not null,
    Country    TEXT default '' not null
        constraint city_ibfk_1
            references country
            on update cascade on delete cascade,
    Province   TEXT default '' not null,
    Population INTEGER,
    Longitude  REAL,
    Latitude   REAL,
    primary key (Name, Province),
    constraint city_ibfk_2
        foreign key (Province, Country) references province
            on update cascade on delete cascade
)

CREATE TABLE "organization"
(
    Abbreviation TEXT not null
        primary key,
    Name         TEXT not null
        constraint ix_organization_OrgNameUnique
            unique,
    City         TEXT,
    Country      TEXT
        constraint organization_ibfk_1
            references country
            on update cascade on delete cascade,
    Province     TEXT,
    Established  DATE,
    constraint organization_ibfk_2
        foreign key (City, Province) references city
            on update cascade on delete cascade,
    constraint organization_ibfk_3
        foreign key (Province, Country) references province
            on update cascade on delete cascade
)

CREATE TABLE "politics"
(
    Country      TEXT default '' not null
        primary key
        constraint politics_ibfk_1
            references country
            on update cascade on delete cascade,
    Independence DATE,
    Dependent    TEXT
        constraint politics_ibfk_2
            references country
            on update cascade on delete cascade,
    Government   TEXT
)

CREATE TABLE "geo_mountain"
(
    Mountain TEXT default '' not null
        constraint geo_mountain_ibfk_3
            references mountain
            on update cascade on delete cascade,
    Country  TEXT default '' not null
        constraint geo_mountain_ibfk_1
            references country
            on update cascade on delete cascade,
    Province TEXT default '' not null,
    primary key (Province, Country, Mountain),
    constraint geo_mountain_ibfk_2
        foreign key (Province, Country) references province
            on update cascade on delete cascade
)`;

type Bucket = { count: number; windowStart: number };

const ipBuckets = new Map<string, Bucket>();
let dailyCount = 0;
let dailyWindowStart = Date.now();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; reason: "ip" | "daily" } {
  const now = Date.now();

  if (now - dailyWindowStart > 24 * 60 * 60 * 1000) {
    dailyWindowStart = now;
    dailyCount = 0;
  }
  if (dailyCount >= DAILY_MAX_REQUESTS) {
    return { ok: false, reason: "daily" };
  }

  const bucket = ipBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > PER_IP_WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now });
    dailyCount += 1;
    return { ok: true };
  }
  if (bucket.count >= PER_IP_MAX_REQUESTS) {
    return { ok: false, reason: "ip" };
  }
  bucket.count += 1;
  dailyCount += 1;
  return { ok: true };
}

export async function POST(req: NextRequest) {
  let body: { question?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "invalid_input" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ status: "invalid_input" }, { status: 400 });
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json({ status: "rate_limited", scope: limit.reason }, { status: 429 });
  }

  const endpoint = process.env.GENERATION_ENDPOINT_URL;
  if (!endpoint) {
    return NextResponse.json({ status: "offline" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    // NOTE: request/response shape below is a placeholder pending the real
    // FastAPI proxy contract — adjust the body and the fields read from
    // `data` once that's confirmed.
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, schema: DEMO_SCHEMA }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return NextResponse.json({ status: "error" }, { status: 502 });
    }

    const data = await upstream.json();
    const sql = typeof data.sql === "string" ? data.sql : null;
    if (!sql) {
      return NextResponse.json({ status: "error" }, { status: 502 });
    }

    return NextResponse.json({
      status: "ok",
      sql,
      latencyMs: typeof data.latency_ms === "number" ? data.latency_ms : Date.now() - startedAt,
      requestId: typeof data.request_id === "string" ? data.request_id : undefined,
    });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return NextResponse.json({ status: isAbort ? "offline" : "error" });
  } finally {
    clearTimeout(timeout);
  }
}
