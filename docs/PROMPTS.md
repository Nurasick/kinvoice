# Kickoff prompts

> Round 2 tasks and kickoff prompts: [TASKS.md](TASKS.md). Pre-submission review prompt: [REVIEW.md](REVIEW.md).

Each member: clone, install, then open Claude Code in the repo and paste your prompt.

```bash
gh repo clone Nurasick/kinvoice && cd kinvoice
npm install
cp .env.example .env.local      # leave OPENAI_API_KEY empty to use the mock AI
npm run dev                     # http://localhost:3000
```

If the skeleton (in-memory API, mock AI, placeholder pages) isn't on `main` yet when you start, `git pull` in a few minutes. Until then: read the docs, plan your files, and build UI/logic only inside your owned paths against the types in `src/shared/`.

---

## Olzhas — AI module + logging flow

```
You are working on Kinvoice (24h hackathon, deadline 12:00 Nov 15 UTC+5). I am Olzhas, owner of Workstream B: AI module + logging flow.

Read first, fully: CLAUDE.md, docs/kinvoice-brief.md, docs/ROLES.md, docs/ARCHITECTURE.md, AGENTS.md, then src/shared/domain.ts, src/shared/api.ts, src/server/ai/types.ts.

My owned paths (edit ONLY these): src/server/ai/** (except types.ts, frozen), src/app/api/ai/**, src/app/app/log/**, src/components/log/**.
Frozen, read-only for me: src/shared/**, src/lib/api/client.ts, src/server/repo/types.ts, src/server/ai/types.ts, package.json, configs. If I need a change there, write the exact diff for me to send to Nurali.

Work on branch feat/log-<thing>. Small PRs to main. Run `npm run check` before every commit.

Tasks, in order:
1. Log page (/app/log) against the MOCK AI (src/server/ai/mock.ts is used automatically when OPENAI_API_KEY is empty):
   - quick-log textarea → POST /api/ai/quick-log via src/lib/api/client.ts → show each DraftEntry as an editable card (kind, date, amount or duration, category, merchant, note, who paid/gave — default caregiver) → "Confirm all" posts to /api/entries; each card can be discarded.
   - manual entry form (same card component, empty).
   - this month's entries list with edit and delete.
   - if fallback=true: show the manual form prefilled with whatever parsed, with a gentle note. Never an error page.
2. Receipt upload (photo or PDF, ≤5 MB) → POST /api/ai/receipt (multipart, field "file") → prefilled card → confirm.
3. Real OpenAI implementation in src/server/ai/openai.ts implementing AiService:
   - parseQuickLog: structured output (JSON schema), validate with Zod (DraftEntry), 12s timeout, salvage partial output, never throw to the route.
   - extractReceipt: vision input for images, PDF input for PDFs; amount, merchant, date, category.
   - draftInvoiceMessage: tones warm/brief/direct; gets the computed MonthlyBalance as input and may only restate those numbers; deterministic template fallback (already in src/server/ai/template.ts).
   - read OPENAI_API_KEY / OPENAI_MODEL only via src/server/ai/config.ts. Never import from client code.
4. Vitest tests for: Zod validation of AI output, fallback on invalid JSON, timeout fallback (mock the OpenAI client).

Use Yernur's src/components/ui/** primitives; don't edit them — if one is missing, make a local one in src/components/log/ and tell Yernur.

Definition of done: with a real key, "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours." becomes 1 expense ($86, medication, CVS) + 1 time entry (180 min, appointments) and saves in one tap; with a bad/missing key everything still works manually.

Start by summarizing the plan in 5 lines, then do task 1.
```

---

## Yernur — caregiver + sibling UX

```
You are working on Kinvoice (24h hackathon, deadline 12:00 Nov 15 UTC+5). I am Yernur, owner of Workstream C: caregiver + sibling UX.

Read first, fully: CLAUDE.md, docs/kinvoice-brief.md, docs/ROLES.md, docs/ARCHITECTURE.md, AGENTS.md, then src/shared/domain.ts, src/shared/api.ts, src/lib/api/client.ts, src/lib/money/.

My owned paths (edit ONLY these): src/app/layout.tsx, src/app/globals.css, src/app/page.tsx, src/app/setup/**, src/app/w/**, src/app/app/layout.tsx, src/app/app/page.tsx, src/app/app/invoice/**, src/app/app/settings/**, src/app/i/**, src/components/ui/**, src/components/{layout,dashboard,invoice,setup,public-invoice}/**, src/lib/payments/**, src/lib/workspace-key.ts.
Frozen, read-only for me: src/shared/**, src/lib/api/client.ts, src/lib/money/**, src/server/**, src/app/api/**, package.json, configs. If I need a change there, write the exact diff for me to send to Nurali.

Work on branch feat/ui-<thing>. Small PRs to main. Run `npm run check` before every commit.

Design direction: calm, warm, trustworthy — this is family and money. Warm off-white paper background, deep ink text, one sage/teal accent, a serif display face paired with a clean sans. Generous spacing, clear hierarchy, money in tabular numerals. Desktop-first, works at 375px. No "you owe" anywhere — always "suggested contribution".

Tasks, in order:
1. Design tokens in globals.css + src/components/ui primitives (Button, Card, Input, Select, Badge, Money, Field, Spinner, EmptyState) + app shell (src/app/app/layout.tsx with nav: Dashboard / Log / Invoice / Settings).
2. Landing page "/": one-line value prop, "Try Sarah's family" (POST /api/demo → store editKey via src/lib/workspace-key.ts → /app) and "Start your own" (/setup).
3. /setup: parent name, caregiver name, siblings (name, optional email, add/remove), hourly value ($25 default), caregiver Venmo/PayPal/Zelle → POST /api/workspaces → show the private edit link (/w/<key>) to bookmark → /app.
4. /w/[key]: save key to localStorage, redirect to /app.
5. Dashboard /app: month picker, out-of-pocket total, per-member money + hours (time value shown separately), suggested contribution per sibling, category breakdown, recent entries, "Create invoice" CTA.
6. /app/invoice: tone picker (warm/brief/direct) → POST /api/ai/invoice-message → editable textarea → Publish (POST /api/invoices) → copyable /i/<token> link; list of past invoices with payment status and "Mark as received".
7. /i/[token] public page (no key needed): parent + month, the caregiver's message, totals, where the money went, time given, each sibling's suggested contribution, Pay buttons (src/lib/payments: Venmo and PayPal deep links with amount prefilled; Zelle as copyable instructions), "I've sent it" (POST /api/public/invoices/:token/payments).
8. /app/settings: edit workspace, copy edit link, delete workspace (confirm in-page, not a browser dialog).
9. Loading/empty/error states, responsive pass.

Definition of done: the demo script runs click by click — Try demo → dashboard shows Sarah's month → Create invoice → open link in a private window → press Pay with Venmo.

Start by summarizing the plan in 5 lines, then do task 1.
```

---

## Nurali — platform, data, money, deploy

```
You are working on Kinvoice (24h hackathon, deadline 12:00 Nov 15 UTC+5). I am Nurali, tech lead and owner of Workstream A: platform, data, money math, deploy, README.

Read first: CLAUDE.md, docs/kinvoice-brief.md, docs/ROLES.md, docs/ARCHITECTURE.md, AGENTS.md.

My owned paths: src/shared/** (frozen contracts — I approve changes), src/lib/api/client.ts, src/lib/money/**, src/server/** except src/server/ai/** (types.ts is mine), src/app/api/** except src/app/api/ai/**, drizzle/**, configs, package.json, README.md, docs/**, CLAUDE.md.

Tasks, in order:
1. Create a Neon Postgres DB; put DATABASE_URL in .env.local; finish src/server/db/schema.ts; `npm run db:push`.
2. Implement src/server/repo/postgres.ts implementing the Repository interface in repo/types.ts; switch src/server/repo/index.ts to Postgres when DATABASE_URL is set (memory repo stays for tests/local).
3. Verify every non-AI endpoint in docs/ARCHITECTURE.md §4 with curl: happy path, 401 on bad key, 400 on bad body, 404 on unknown token.
4. Vercel: import repo, set DATABASE_URL, OPENAI_API_KEY, OPENAI_MODEL; deploy; share the URL with the team.
5. Money math: tests for rounding, empty months, siblings who overpaid, single-sibling families. Coverage ≥ 90% on src/lib/money.
6. Hardening: simple per-IP rate limit on /api/ai/** and /api/demo, body size limits, delete-workspace cascade.
7. README: what/why, live link, screenshots, architecture diagram, setup, tests, AI rules.
8. Merge teammates' PRs (rebase, `npm run check`), keep main deployable.
```

---

## Integration check (anyone, against production)

```
Run an end-to-end check of Kinvoice on <PROD_URL> using the playwright-cli skill. Do not change any code.
1. Open "/" → click "Try Sarah's family" → dashboard shows a non-zero out-of-pocket total, 3 siblings, a suggested contribution for each sibling (caregiver's is $0), and time shown separately.
2. Go to Log → type "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours." → expect 2 draft cards (expense $86.00 medication; time 3h appointments) → confirm → both appear in the list and the dashboard total rises by $86.00.
3. Upload a receipt image → a prefilled card appears → confirm.
4. Go to Invoice → pick "warm" → a message appears that mentions the real total → publish → copy the /i/<token> link.
5. Open the link in a fresh context (no localStorage) → page loads with no login, shows the message, breakdown and a "Pay with Venmo" link whose URL contains the brother's amount → click "I've sent it".
6. Back as caregiver → the invoice shows the brother as "sent" → "Mark as received" works.
7. Confirm the words "you owe" appear nowhere. Report pass/fail per step with screenshots.
```
