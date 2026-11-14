# Kinvoice: Project Brief (Business Cup 2.0 hackathon)

This file is the single source of truth for what we are building. Read it fully before planning or writing code.

## 1. Competition context

- Event: Business Cup 2.0 "From Zero to Product", Nazarbayev University, Nov 14-15, 2026.
- Challenge: build a web product that closes a fundamental pain for adults in the US, one they will pay for.
- Constraints (pass/fail): B2C only, web only (runs in the browser, no mobile apps), all 3 submission items.
- Deadline: **12:00, Nov 15 (Asia/Qyzylorda, UTC+5)**. Resubmission allowed until then; latest version is reviewed.
- Submission (one per team, by the captain):
  1. Pitch deck, PDF, max 10 slides
  2. Production link: live product the jury can open and use end-to-end, **no sign-up or login required**
  3. Public GitHub repo: no access requests, no login
- Pitch: 5 min + 2 min Q&A. Top 10 finalists compete for 5,000,000 KZT.

### Judging criteria
| Weight | Criterion | What the jury checks |
|---|---|---|
| 40% | Does it work? (product and engineering) | Works end-to-end in production, not a mockup. Core value is real, not faked or hardcoded. Quality of UX and code: **they read the repo**. |
| 20% | What do we sell? (value and retention) | What the user pays for and why they come back tomorrow. |
| 15% | Who do we sell to? (problem and user) | Clear problem choice, deep understanding of the target user. |
| 15% | Why does it make money? (business potential) | Big or growing niche, $100M ARR long-term, LTV > CAC. |
| 10% | Is it new? (originality) | Not a copy-paste of an existing business. |

## 2. The product

**One line:** Kinvoice turns the unpaid care one sibling gives an aging parent into a clear monthly "care invoice": her siblings open a link with no account, see what the parent's care cost and who gave money and time, and pay their suggested contribution in one click.

**Target user:** the 35-45 year old "default caregiver" sibling (usually a daughter) who lives closest to an aging parent, pays and drives and manages, while siblings in other cities help little. Persona: Sarah, 39, Columbus, Ohio, works full time, two kids; mom 71; brother in Denver, sister in Atlanta.

**Key data (for the pitch, not the code):** 63M US family caregivers (AARP 2025); only 1 in 10 families share care equally, 40% of caregivers get no sibling help (Northwestern Mutual); 69% of adults sharing parent care fought with siblings, money is the #1 cause (Bay Alarm Medical survey).

**Positioning vs competitors:** SplitKin ($4.99/mo) and CareShare (yourcareshare.com) require siblings to join a shared space. Kinvoice is built for families where siblings **won't** join: the caregiver is the only user; siblings only receive a link.

### Core loop: log, invoice, settle
1. **Family setup (2 min):** parent name, siblings (names, optional emails), hourly value for care time (e.g. $25/h, shown separately from money).
2. **AI quick log:** caregiver types one sentence, e.g. "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours." AI returns structured entries (1 expense + 1 time entry with categories) shown as cards; she confirms in one tap or edits.
3. **AI receipt reading:** upload photo or PDF; AI extracts amount, merchant, date, category; pre-fills an entry for confirmation.
4. **Balance dashboard:** this month's out-of-pocket total, each sibling's money and hours, equal split of out-of-pocket costs labeled **"suggested contribution"** (never "you owe").
5. **AI-drafted care invoice:** one click drafts the monthly page. AI writes a short warm family update from the month's real data. Caregiver picks tone (warm / brief / direct), edits, then publishes a private unguessable link. Opening it needs no account.
6. **Settle up:** pay button per sibling (Venmo / PayPal deep links with amount prefilled; Zelle shown as instructions), "mark as received" for the caregiver.

### AI rules (non-negotiable)
- AI removes effort and finds words; it **never decides money**. All totals, splits and balances are plain deterministic code with tests.
- Every AI output is a draft the caregiver confirms or edits. Nothing is sent without her click.
- If AI fails or is slow: manual entry and a template message still work (graceful fallback).
- AI responses for logging/receipts must be **structured JSON validated against a schema**; invalid output = show manual form prefilled with whatever parsed.
- The API key lives **only on the server** (env var). Never in client code, never committed. The repo is public.

### 24-hour MVP scope
**Must have**
- Family setup
- AI quick log (sentence to confirmed entries) + manual entry fallback
- AI receipt reading (photo/PDF to prefilled entry)
- Balance dashboard (deterministic math)
- AI-drafted care invoice with tone picker, editable, published as private no-login link
- Pay buttons + "mark as received"
- **Demo mode:** a pre-filled "Sarah's family" (a realistic month of entries) so the jury sees value instantly, plus "Start your own" with no sign-up
- Deployed live; public repo with clean README

**Stretch (only after must-haves are done and tested)**
- "Pledge a task instead of money" on the invoice
- "My contribution" yearly summary (downloadable)
- Voice input for quick log

**Cut:** income-based splits, AI conversation scripts, care agreement, real payments processing, real auth.

### "No login" design
- The jury must use everything without signing up. Approach: a "family workspace" is created anonymously and identified by an unguessable ID stored in the browser (localStorage) plus a private "edit link" the caregiver can bookmark. Invoice links are separate, read-only, unguessable tokens.
- Demo family is seeded data, resettable.

### Demo script (30 seconds of the pitch)
Type one messy sentence and watch it become two entries; snap a pharmacy receipt; click "Create invoice"; open the link as the brother and press Pay.

## 3. Team and tools

- Team size: **3**
- Members:
  - **Nurali**: Full-stack claude code
  - **Olzhas**: Full-stack claude code
  - **Yernur**: Full-stack claude code
- Every member uses **Claude Code** on their own machine. The plan must let 3 Claude Code sessions work in parallel without editing the same files.
- AI provider for the product: **OpenAI**. The key will be provided as an env var.
- Deployment: **Vercel** for the frontend. The backend either runs on Vercel too (serverless API routes in the same app) or on a separate host (e.g. Render or Railway), with a managed Postgres (e.g. Neon or Supabase). Planner: prefer the simplest option with the fewest moving parts, ideally one repo and one deploy, and explain the choice.

## 4. Quality bar
- The jury reads the repo: clear structure, README with setup + architecture overview, typed code, tests for the money math, no dead code, no secrets.
- UX: clean, calm, trustworthy (this is about family and money). Desktop-first, responsive.
- Privacy: store amounts, categories, notes; no medical records. Unguessable links. Delete-workspace option.
