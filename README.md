# Kinvoice

Kinvoice turns the unpaid care one sibling gives an aging parent into a clear monthly **care invoice**. Siblings open a link with no account, see what the care cost and who gave money and time, and pay their suggested contribution in one click.

Built for Business Cup 2.0 (Nazarbayev University, Nov 14–15, 2026).

- **Live:** _coming soon_
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
| `npm run db:push` | Push the Drizzle schema to `DATABASE_URL` |

## How it works

- **Next.js 16** app: the UI and the API (route handlers) ship as one Vercel deploy.
- **No login.** Caregivers hold an unguessable edit key, and siblings get a separate read-only invoice link.
- **AI drafts, code decides.** OpenAI turns sentences and receipts into draft entries and words the monthly update. Every total and split comes from pure, tested functions in `src/lib/money`.
- **Graceful fallback.** If the AI is down, manual entry and a template message still work.

## Team

Nurali, Olzhas, Yernur. Who owns what: [docs/ROLES.md](docs/ROLES.md).
