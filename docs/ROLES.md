# Roles and parallel work plan

Stack: **Next.js 16 (App Router) + TypeScript, one repo, one Vercel deploy.** API = Next route handlers in `src/app/api/**`. DB = Neon Postgres via Drizzle. Validation = Zod. AI = OpenAI, server-only. Tests = Vitest.
Full design: `docs/ARCHITECTURE.md`. Product: `docs/kinvoice-brief.md`.

## Ownership map (no two people own the same file)

| Path | Owner |
|---|---|
| `src/shared/**` (domain types, API contract) — **FROZEN** | Nurali (change via request only) |
| `src/lib/api/client.ts` (typed fetch client) — **FROZEN** | Nurali |
| `src/server/repo/types.ts` (repository interface) — **FROZEN** | Nurali |
| `src/server/ai/types.ts` (AI service interface) — **FROZEN** | Nurali (Olzhas implements it) |
| `.env.example`, `package.json`, `package-lock.json`, configs (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `drizzle.config.ts`) | Nurali |
| `CLAUDE.md`, `README.md`, `docs/**` | Nurali |
| **Workstream A — Nurali: platform, data, money, deploy** | |
| `src/server/db/**`, `src/server/repo/**` (except `types.ts` frozen), `src/server/seed/**`, `src/server/http.ts`, `src/server/tokens.ts`, `src/server/services.ts` | Nurali |
| `src/lib/money/**` | Nurali |
| `src/app/api/**` **except** `src/app/api/ai/**` | Nurali |
| `drizzle/**` (migrations) | Nurali |
| **Workstream B — Olzhas: AI + logging** | |
| `src/server/ai/**` (except `types.ts` frozen) | Olzhas |
| `src/app/api/ai/**` (quick-log, receipt, invoice-message routes) | Olzhas |
| `src/app/app/log/**` (Log page: quick log, receipt upload, manual form, entry list/edit) | Olzhas |
| `src/components/log/**` | Olzhas |
| **Workstream C — Yernur: caregiver + sibling UX** | |
| `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` (landing + "Try demo" / "Start your own") | Yernur |
| `src/app/setup/**`, `src/app/w/**` (edit-link landing) | Yernur |
| `src/app/app/layout.tsx`, `src/app/app/page.tsx` (dashboard), `src/app/app/invoice/**`, `src/app/app/settings/**` | Yernur |
| `src/app/i/**` (public invoice page for siblings) | Yernur |
| `src/components/ui/**` (design system), `src/components/{layout,dashboard,invoice,setup,public-invoice}/**` | Yernur |
| `src/lib/payments/**` (Venmo/PayPal deep links, Zelle text), `src/lib/workspace-key.ts` (localStorage key) | Yernur |

Shared files may be **read and imported by anyone**. If you need a change to a frozen file, ask Nurali (message the team chat with the exact diff). Nurali merges it to `main` in a tiny PR; everyone rebases.

Olzhas uses Yernur's `src/components/ui/**` primitives but does not edit them; if a primitive is missing, build it locally in `src/components/log/` and tell Yernur.

## Workstreams

### A — Nurali (lead): platform, data, money math, deploy, README, pitch support
- **Goal:** every API endpoint in `src/shared/api.ts` works against Postgres in production; money math is correct and tested; demo family seeded; site deployed.
- **Depends on:** nothing. Starts from the in-memory repository already in the skeleton.
- **Tasks in order:** (1) skeleton + contracts pushed (hour 0-1) → (2) Neon DB + Drizzle schema + migration → (3) Postgres repository implementing `repo/types.ts` → (4) all non-AI routes on Postgres → (5) Vercel project + env vars + first deploy (by hour 6) → (6) money-math test coverage ≥ 90% → (7) delete-workspace, rate limits, input limits → (8) README, architecture diagram, screenshots for the deck.
- **Done when:** `npm test` green; production `/api/demo` → dashboard → publish invoice → `/i/<token>` works; README complete.
- **Checks:** curl every endpoint (see ARCHITECTURE §4), wrong key → 401, invalid body → 400 with Zod details.

### B — Olzhas: AI module + logging flow
- **Goal:** "type one messy sentence → two correct cards → confirm" and "snap a receipt → prefilled card → confirm", both with graceful fallback.
- **Depends on:** `src/server/ai/types.ts` (frozen interface), `src/shared/**`. Until real OpenAI works, `src/server/ai/mock.ts` returns realistic drafts (used automatically when `OPENAI_API_KEY` is empty or `AI_MOCK=1`).
- **Tasks in order:** (1) Log page UI against the mock AI: quick-log box, draft cards (edit/confirm/discard), manual entry form, this month's entry list with edit/delete → (2) real `openai.ts`: `parseQuickLog` with JSON schema output + Zod validation + 12s timeout → (3) `extractReceipt` (vision, image + PDF) → (4) `draftInvoiceMessage` (3 tones, uses only real numbers passed in, template fallback) → (5) unit tests for validation/fallback paths (mock the OpenAI client).
- **Done when:** with a real key, the demo sentence "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours." yields 1 expense + 1 time card; invalid AI output never crashes; with no key everything still works via manual form + template.
- **Checks:** kill the network / set a bad key → UI shows manual form prefilled, no error page.

### C — Yernur: caregiver + sibling UX
- **Goal:** calm, trustworthy UI for setup, dashboard, invoice composer, public invoice and settle-up.
- **Depends on:** `src/lib/api/client.ts` (talks to the in-memory API from minute one), `src/lib/money` (formatting), AI endpoint `/api/ai/invoice-message` (mocked from the start).
- **Tasks in order:** (1) design tokens + `ui/` primitives (Button, Card, Input, Badge, Money) + app shell → (2) landing page with "Try Sarah's family" (POST `/api/demo`) and "Start your own" → (3) setup page → (4) dashboard: month total, per-sibling money + hours, "suggested contribution" → (5) invoice composer: tone picker, AI draft, edit, publish, copy link → (6) public invoice `/i/[token]`: update, breakdown, Pay with Venmo/PayPal deep links, Zelle instructions, "I've sent it" → (7) "Mark as received" on dashboard/invoice → (8) responsive pass, empty/loading/error states.
- **Done when:** the 30-second demo script runs click-by-click; works at 1440px and 375px.
- **Checks:** open `/i/<token>` in a private window — loads with no key; never shows the words "you owe".

## Git workflow
- `main` is always deployable. Work on `feat/<area>-<thing>` branches (e.g. `feat/log-quick-log`).
- Small PRs (≤ ~300 lines), `npm run check` (lint + typecheck + test) must pass. Any teammate can approve; **Nurali merges**. Rebase on `main` before merging.
- Pull `main` at every checkpoint.

## Checkpoints (Asia/Qyzylorda, UTC+5)
| When | Milestone |
|---|---|
| Nov 14, hour 1 | Contracts frozen, skeleton on `main`, everyone running locally |
| hour 4 | Each workstream's first screen/endpoint merged (against mocks) |
| hour 6 | First production deploy on Vercel (Nurali) |
| hour 8 | **End-to-end happy path** on prod: demo → quick log → dashboard → publish → public link → pay button |
| hour 12 | Real OpenAI on prod, Postgres on prod, receipts working |
| overnight → 08:00 Nov 15 | Polish, empty/error states, demo data realism, stretch only if all green |
| **10:00 Nov 15** | **Code freeze.** Only demo-blocking fixes after this |
| 11:00 | Repo made public, README final, deck screenshots |
| **11:30** | **Submit** (deck PDF, prod link, public repo). Hard deadline 12:00 |
