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
- `/sql-demo.html` — standalone Text-to-SQL sandbox (static page; calls a query-only AWS Lambda)

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

## Configuration

- `src/app/site.ts` — public origin used by the canonical URL, Open Graph tags, `robots.ts`,
  and `sitemap.ts`. Update it when the domain is final.

## Deployment

Deployed on Vercel from the default branch.
