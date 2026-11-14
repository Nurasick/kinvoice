# Kinvoice — rules for every Claude Code session

Read before doing anything: `docs/kinvoice-brief.md` (product), `docs/ROLES.md` (who owns what), `docs/ARCHITECTURE.md` (stack, data model, API contract, AI design). Then `AGENTS.md` (Next.js 16 notes — this Next version differs from your training data; check `node_modules/next/dist/docs/` before using an unfamiliar API).

## Hard rules
1. **Only edit files in your owned paths** (`docs/ROLES.md`). Reading and importing anything is fine.
2. **Never edit frozen contract files** (`src/shared/**`, `src/lib/api/client.ts`, `src/server/repo/types.ts`, `src/server/ai/types.ts`, configs, `package.json`) unless you are Nurali. Need a change? Write the exact diff and ask Nurali.
3. **Use the shared types** from `@/shared/domain` and `@/shared/api`. Don't redefine shapes locally.
4. **Work on your own branch** `feat/<area>-<thing>`; small PRs to `main`; never push to `main` directly (Nurali merges).
5. Before every commit: `npm run check` (lint + typecheck + tests) must pass.
6. **Never commit secrets.** API keys live only in `.env.local` (gitignored) and Vercel env vars. The repo will be public.
7. New dependency? Ask Nurali (owner of `package.json`).

## Product rules (from the brief, non-negotiable)
- AI never decides money. Totals, splits and balances come only from `src/lib/money` (pure, tested, integer cents).
- Every AI output is a draft the caregiver confirms or edits. Nothing is saved or sent without her click.
- AI failure/timeout/invalid JSON → manual form prefilled with whatever parsed, or the template message. Never an error page.
- AI output is JSON validated with Zod against `@/shared/domain` schemas.
- `OPENAI_API_KEY` is read only in `src/server/**`. Never import `src/server/**` from a client component.
- Money is integer cents, time is integer minutes. Format only at the UI edge (`formatCents`, `formatMinutes`).
- UI copy says **"suggested contribution"**, never "you owe". Calm, warm, trustworthy.
- No login anywhere. Caregiver auth = unguessable edit key (header `x-workspace-key`); siblings = unguessable invoice token.
- Store amounts, categories, short notes. No medical records.

## Code style
- TypeScript strict, no `any`, explicit types on exports. Functions < 50 lines, files < 400 lines.
- Immutable updates; early returns; no `console.log` left in code.
- Server components by default; `"use client"` only where needed.
- Tests: Vitest, colocated `*.test.ts`. Money math and AI validation must be tested.

## Commands
`npm run dev` · `npm test` · `npm run check` · `npm run db:push` (Nurali)
