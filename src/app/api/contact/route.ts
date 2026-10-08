import { NextRequest, NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

// Receives the contact form on the home page and forwards it to my inbox
// through Resend's REST API. The API key stays on the server, and the visitor's
// address goes in Reply-To so I can answer straight from my mail client.
//
// Environment (set in the Vercel project settings):
//   RESEND_API_KEY   required. Until it is set this route reports "offline",
//                    and the form tells the visitor to email me instead.
//   CONTACT_TO_EMAIL optional. Where messages go. Defaults to the address
//                    already shown on the site.
//   CONTACT_FROM     optional. Defaults to Resend's shared test sender, which
//                    only delivers to the address the Resend account was
//                    created with. Set it once a domain is verified.
//
// Abuse protection is deliberately light: a honeypot field, a minimum fill
// time, and an in-memory per-IP counter. Like the SQL demo route, the counters
// are not shared across serverless instances and reset on cold start, so they
// stop casual repeat sends rather than a determined script.

const MIN_FILL_MS = 1500;
const PER_IP_WINDOW_MS = 10 * 60 * 1000;
const PER_IP_MAX = 3;
const DAILY_MAX = 30;
const UPSTREAM_TIMEOUT_MS = 10_000;

const DEFAULT_TO = "rrishavrraj@gmail.com";
const DEFAULT_FROM = "Portfolio contact <onboarding@resend.dev>";

type Bucket = { count: number; windowStart: number };
const ipBuckets = new Map<string, Bucket>();
let dailyCount = 0;
let dailyWindowStart = Date.now();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  if (now - dailyWindowStart > 24 * 60 * 60 * 1000) {
    dailyWindowStart = now;
    dailyCount = 0;
  }
  if (dailyCount >= DAILY_MAX) return false;

  const bucket = ipBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > PER_IP_WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now });
    dailyCount += 1;
    return true;
  }
  if (bucket.count >= PER_IP_MAX) return false;
  bucket.count += 1;
  dailyCount += 1;
  return true;
}

// Drops control characters (including newlines) so a name can never reach the
// subject line as anything but plain text.
function oneLine(s: string): string {
  return s.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  // Browsers always send Origin on a cross-site POST; refuse when it is not this site.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      /* falls through to the refusal below */
    }
    if (originHost !== host) {
      return NextResponse.json({ status: "forbidden" }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid_input" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? oneLine(body.name) : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.replace(/\r\n/g, "\n").trim() : "";

  // Bots fill the hidden field or submit instantly. Report success and send nothing,
  // so there is no signal to adapt to.
  const honeypot = typeof body.website === "string" ? body.website : "";
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
  if (honeypot !== "" || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ status: "ok" });
  }

  const errors = validateContact({ name, email, message });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ status: "invalid_input", errors }, { status: 400 });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return NextResponse.json({ status: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ status: "offline" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}\n`,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return NextResponse.json({ status: "error" }, { status: 502 });
    }
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
