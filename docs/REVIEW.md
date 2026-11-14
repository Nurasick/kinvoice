# Review prompt

Paste the block below into a fresh Claude Code session at the repo root, after `git pull` on `main`. It reviews only. It changes no files and pushes nothing. Run it once now and again after the 08:00 checkpoint. Anyone can run it. If two people run it, give each a different **Focus** line so they don't duplicate work.

```text
You are reviewing Kinvoice before a hackathon jury sees it (deadline 12:00 Nov 15, UTC+5).
The jury weighs: 40% "does it really work end to end in production" (they read the repo),
20% value and retention, 15% problem and user, 15% business, 10% originality.

Read first: CLAUDE.md, docs/kinvoice-brief.md, docs/ROLES.md, docs/ARCHITECTURE.md, PRODUCT.md, DESIGN.md.
Production: https://kinvoice-taupe.vercel.app (demo: "Try Sarah's family", no sign-up).

Focus: <ALL | money+API | AI | caregiver UI | sibling page /i | landing + i18n | repo quality>

Rules
- Do NOT edit, commit or push anything. Report only.
- Every finding must be verified: quote the code (file:line) or the exact page behaviour you observed.
  No "might", "consider" or style nits without a concrete failure.
- Never paste secrets, edit keys or invoice tokens into your report.

Check, in this order
1. Demo-critical path on production, desktop 1440px and phone 375px:
   landing -> Try Sarah's family -> dashboard -> Log (type "Paid $86 at CVS for Mom's meds, then drove
   her to the cardiologist, 3 hours.") -> confirm both cards -> Invoice -> publish -> Text/WhatsApp link
   -> open the sibling's personal link in a private window -> Pay with Venmo link -> "I've sent it"
   -> back as caregiver -> Mark as received -> dashboard says everyone is settled.
   Report any step that breaks, is confusing, scrolls sideways, or takes longer than 5 s.
2. Product rules (non-negotiable, from CLAUDE.md): the word "owe" never appears; AI never decides money
   (all numbers come from src/lib/money); every AI output is a draft the caregiver confirms; AI failure
   falls back to a manual form or the template, never an error page; no medical details stored.
3. Correctness: money math (integer cents, splits sum to the total), month boundaries, payment status
   never downgrades from received, deleting a workspace kills every link, invalid input returns 400 not 500.
4. Security: OPENAI_API_KEY only in src/server/**, no secrets in git history, rate limits on AI and
   sign-up routes, edit keys stored hashed, tokens not leaked via Referer, server code never imported by
   client components, no dangerouslySetInnerHTML with user text.
5. UX quality: empty, loading and error states on every screen; copy says "suggested contribution";
   numbers readable at 375px; keyboard focus visible; contrast at least 4.5:1 for body text.
6. i18n: the landing works in EN/RU/KZ (?lang=ru, ?lang=kk); list every user-facing screen that is still
   English-only, ordered by how likely the jury is to see it.
7. Repo quality the jury will read: README accuracy (commands work, links live), no dead code, no stray
   TODOs on finished features, no console.log, tests meaningful, CI green (`npm run check`, `npm run build`).

Output
A single markdown table sorted by severity, then a 5-line summary:
| # | Severity (BLOCKER / HIGH / MEDIUM / LOW) | Where (file:line or page + step) | What is wrong (observed) | Fix (concrete) | Owner (from docs/ROLES.md) |
BLOCKER = breaks the demo or a product rule. HIGH = a juror would notice. MEDIUM = polish. LOW = optional.
End with: "Top 3 to fix before 10:00 code freeze" and which owner takes each.
```

## After the review

Paste the table in the team chat. Nurali turns BLOCKER and HIGH rows into tasks in [TASKS.md](TASKS.md) under the right owner. MEDIUM rows wait until every BLOCKER and HIGH row is fixed. LOW rows are dropped.
