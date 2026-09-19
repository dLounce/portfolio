# Rishav Raj — portfolio

Personal portfolio and project write-ups for Rishav Raj, an AI/ML engineer working on LLM
post-training, deployment, evaluation, and agent systems.

Live: set the final alias/domain in `src/app/site.ts`.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 — theme tokens live in `src/app/globals.css` (no `tailwind.config`)
- Self-hosted Spectral + JetBrains Mono via `next/font`
- Deployed on Vercel

## Routes

- `/` — home: intro + proof strip, Sentinel panel, projects, thesis, experience, contact
- `/work/text-to-sql` — SFT then GRPO post-training and CPU (GGUF) deployment
- `/work/sentinel` — privilege-separated procurement agent + adversarial evaluation
- `/work/log2agent` — process mining → generated LangGraph agent with a repair loop
- `/work/dgm4` — multimodal image–text manipulation detection
- `/work/ballistic` — LLM short-answer grader (internship)
- `/sql-demo.html` — standalone Text-to-SQL sandbox (static page): a case-picker calling a
  query-only AWS Lambda, plus a free-text box that calls this app's own `/api/generate-sql`
  route, which proxies to the live EC2 generation endpoint

## Local setup

    npm install
    npm run dev      # http://localhost:3000
    npm run lint
    npm run build

## Content & data sources

- Project metrics are transcribed from each project's own repository and saved evaluation output;
  the numbers here are meant to match those sources and the CV exactly.
- Résumé PDF is served from `public/resume/Rishav_Resume.pdf`.
- Card images live in `src/Assets/` (optimized by `next/image`); other static assets in `public/`.
- The SQL demo calls a query-only AWS Lambda and degrades gracefully if the endpoint is cold.
- The free-text box on the same page calls `/api/generate-sql` (`src/app/api/generate-sql/route.ts`),
  which forwards to the real EC2/llama.cpp generation endpoint server-side, so the endpoint URL
  and any auth token never reach the client. That EC2 instance runs on a day-only schedule to
  control cost; outside those hours the route reports "offline" and the page falls back to a
  real recorded example instead of a dead demo.

## Configuration

- `src/app/site.ts` — public origin used by the canonical URL, Open Graph tags, `robots.ts`,
  and `sitemap.ts`. Update it when the domain is final.
- `GENERATION_ENDPOINT_URL` — set this in the Vercel project's environment variables to the
  live EC2/FastAPI generation endpoint. Until it is set, `/api/generate-sql` always reports
  itself as offline, which is accurate. The route's request/response shape is a placeholder
  (`{"question": "..."}` in, `{"sql": "..."}` out) — adjust `route.ts` to match the FastAPI
  proxy's real contract once confirmed.
- Rate limiting on `/api/generate-sql` is a best-effort, in-memory per-IP + daily counter. It
  resets on cold start and is not shared across serverless instances, so treat it as a soft
  limit rather than a hard guarantee. If this demo gets real traffic, back it with Vercel KV or
  Upstash Redis instead.

## Deployment

Deployed on Vercel from the default branch.
