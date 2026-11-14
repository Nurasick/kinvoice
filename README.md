# Kinvoice

Kinvoice turns the unpaid care one sibling gives an aging parent into a clear monthly **care invoice**. Siblings open a link with no account, see what the care cost and who gave money and time, and pay their suggested contribution in one click.

Built for Business Cup 2.0 (Nazarbayev University, Nov 14–15, 2026).

- **Live:** https://kinvoice-taupe.vercel.app
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Product brief:** [docs/kinvoice-brief.md](docs/kinvoice-brief.md)

## Run locally

```bash
npm install
cp .env.example .env.local   # empty values = mock AI + in-memory store
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | Lint + typecheck + tests (run before every commit) |
| `npm run build` | Production build |
| `npm run db:generate` | Create a SQL migration in `drizzle/` after editing `src/server/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` (runs automatically before every Vercel build) |

## Try it in 30 seconds

1. Open the live link and click **Try Sarah's family**. You get your own private copy of a demo family: Sarah cares for Mom, and Mike and Emily live far away.
2. **Log:** type `Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours.` The AI drafts one expense card and one time card. Confirm them.
3. **Dashboard:** see the month's total, who gave money and who gave time, and each sibling's suggested contribution.
4. **Invoice:** pick a tone, let the AI draft the update, edit it, publish, and copy the link.
5. Open the link in a private window, as a sibling would: no account needed. Pay with Venmo or PayPal, or tap "I've sent it".

## How it works

- **Next.js 16** app: the UI and the API (route handlers) ship as one Vercel deploy.
- **No login.** Caregivers hold an unguessable edit key, and siblings get a separate read-only invoice link.
- **AI drafts, code decides.** OpenAI turns sentences and receipts into draft entries and words the monthly update. Every total and split comes from pure, tested functions in `src/lib/money`.
- **Graceful fallback.** If the AI is down, manual entry and a template message still work.

## Quality and safety

- **Tests:** 93 Vitest tests. They cover the money math (100% of lines), the API route handlers end to end (auth, validation, the payment-mark rules, delete), AI output validation and fallbacks, and the repository contract. CI runs lint, typecheck, tests and the build on every PR.
- **Privacy:** no accounts and no medical records, only amounts, categories and short notes. The server stores only a SHA-256 hash of each edit key. Deleting a workspace removes everything, and its invoice links stop working.
- **Hardening:** every request body is validated with Zod (400 with details). AI and sign-up endpoints are rate-limited per IP. Pages that carry secret tokens are sent with `no-store`, `noindex` and `no-referrer`. The OpenAI key exists only on the server.

## Team

Nurali, Olzhas, Yernur. Who owns what: [docs/ROLES.md](docs/ROLES.md).
