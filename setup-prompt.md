# Prompt for the planning session

Put `kinvoice-brief.md` into an empty folder that will become the repo, open Claude Code in that folder, and paste everything below the line. Fill in the remaining [FILL IN] fields in the brief first (Olzhas's and Yernur's strengths, AI provider).

---

You are the tech lead for a 24-hour hackathon team of 3 (Nurali, Olzhas, Yernur). The file `kinvoice-brief.md` in this folder describes the product, the judging criteria, the MVP scope and the constraints. Read it fully first. The deadline is 12:00, Nov 15 (UTC+5), so optimize for a product that **fully works end-to-end in production**, over breadth.

Every team member runs their own Claude Code session. Your job is to set up the project so those sessions can work **in parallel without editing the same files or blocking each other**.

## Produce the following

### 1. Architecture (`docs/ARCHITECTURE.md`)
- Pick ONE simple stack that a small team can ship and deploy in hours, matching the team's strengths listed in the brief. Prefer a single language across frontend and backend if it speeds things up, and a host with one-command deploys. Justify the choice in 3 to 5 lines.
- Diagram (Mermaid) of components: frontend pages, API routes, AI service module, database, external links (Venmo/PayPal deep links).
- Data model: tables/collections with fields and types (Workspace, Parent, Sibling, Entry with kind expense|time, Invoice with token, Payment mark). Include how the anonymous no-login workspace works (unguessable IDs, edit link, read-only invoice token).
- API contract: every endpoint with method, path, request and response JSON shapes, and error format.
- AI module design: one server-side module with exactly three functions (parse quick-log sentence, extract receipt, draft invoice message), each with its prompt, its JSON output schema, validation, timeout and fallback behavior. The API key is read from an env var on the server only.
- Money math: pure functions (monthly totals, per-sibling money and hours, equal split of out-of-pocket costs, suggested contribution), fully unit-tested, with integer cents (no floats).
- Demo seed: what "Sarah's family" contains (a realistic month: 10 to 15 expenses, 6 to 10 time entries, 3 siblings with uneven contributions).

### 2. Roles and parallel work plan (`docs/ROLES.md`)
- Split work into one workstream per team member (team size is in the brief). Each workstream owns **specific folders/files**; list them explicitly. No two workstreams own the same file.
- Shared files (types, API contract, DB schema, env example) are created by you NOW in the skeleton, then frozen. Changes to them go through one designated owner.
- For each workstream: goal, owned paths, inputs it depends on (and the mock to use until the real thing exists), definition of done, and acceptance checks.
- Integration plan: when and how branches merge (feature branches, small PRs to `main`, who merges), plus checkpoints with times, e.g. contracts frozen in hour 1, end-to-end happy path by hour 8, deployed by hour 12, polish and demo data after, **code freeze at 10:00 Nov 15**, submission by 11:30.
- One person also owns: deployment, README, and the pitch deck support (screenshots, demo flow).

### 3. Repo skeleton (create it, then commit)
- Folder structure matching the ownership map, with placeholder files where each workstream will work.
- `CLAUDE.md` at the root: the rules every Claude Code session must follow: read the brief and docs first; only edit files in your owned paths; never edit shared contract files without the owner; use the shared types; work on your own branch; run tests and lint before committing; never commit secrets; keep the AI rules from the brief.
- `kinvoice-brief.md` copied into `docs/`.
- Shared contracts implemented as real code (types/interfaces, API schema, DB schema/migrations), plus mock data and a mock AI client so frontend work can start immediately.
- `.env.example` with the needed variables (no real values), `.gitignore`, README stub (what it is, how to run, architecture link), basic lint/format config, test runner set up with one passing test for the money math.
- Make sure it builds and runs locally before you finish.

### 4. Kickoff prompts (`docs/PROMPTS.md`)
- One ready-to-paste prompt per team member for their own Claude Code session. Each prompt: their role, owned paths, the docs to read first, the exact first tasks in order, the mocks to use, the definition of done, and the rule to stay inside their paths and branch.
- One short "integration check" prompt anyone can run to verify the end-to-end flow (demo family, quick log, receipt, invoice link, pay button) on the deployed site.

## Constraints to respect
- Everything works without sign-up or login.
- Desktop-first, responsive, calm trustworthy UI.
- No real payment processing: pay buttons are deep links; Zelle is instructions.
- Keep scope to the brief's Must-have list; stretch items only after the end-to-end flow is deployed and tested.

When done, give me: a short summary of the stack and the split, the list of created files, and the commands each member runs to get started (clone, install, env, run).
