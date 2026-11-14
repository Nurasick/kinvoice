# Round 2 tasks (Nov 14 evening → Nov 15 10:00 code freeze)

Production now covers the whole loop: landing → demo → log → dashboard with a monthly progress strip → invoice → a personal link per sibling with Text/WhatsApp/Email → sibling page → "I've sent it" → "Mark as received". The fridge-door design runs on every screen (see DESIGN.md). Round 2 is about **language, clarity and demo polish**, not new features.

**Before you start:** `git pull` on `main`. The shared design files (`globals.css`, `components/ui`, `Logo`, `AppNav`, the app header) changed today. Branch from fresh `main`. Keep PRs small. Nurali merges.

| When (UTC+5) | Checkpoint                                      |
| ------------ | ----------------------------------------------- |
| 23:00 Nov 14 | Every P0 task has a PR open                     |
| 08:00 Nov 15 | Every P0 and P1 task merged; run docs/REVIEW.md |
| 10:00        | Code freeze: demo-blocking fixes only           |
| 11:00        | Repo public, README final, deck screenshots     |
| 11:30        | Submit                                          |

P0 = the jury will see it in the demo. P1 = a juror who clicks around will see it. P2 = only if every P0 and P1 task is done.

---

## Nurali: platform, i18n plumbing, release

| #   | P     | Task                                                                                                                                                                                                           | Files                                                                                                           | Done when                                                                          |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| N1  | P0    | Add optional `locale: "en" \| "ru" \| "kk"` to `QuickLogRequest` and `InvoiceMessageRequest` in the frozen contract. Unblocks O2 and O3.                                                                       | `src/shared/api.ts`, `src/lib/api/client.ts`                                                                    | Merged first. Old clients still work (the field is optional).                      |
| N2  | P0    | App-wide locale: an `useLocale()` hook for client components, plus a server helper that reads `?lang`, then the cookie, then Accept-Language, as on the landing. The EN/RU/KZ switch goes into the app header. | `src/lib/i18n/**`, `src/components/landing/LanguageSwitcher.tsx` (move to `components/layout` if Yernur agrees) | One switch changes the language on landing, app and `/i`, and the choice persists. |
| N3  | P0    | The language travels with personal links: the share message and the link carry the caregiver's current locale (`&lang=ru`).                                                                                    | `src/components/invoice/share-links.ts` (+ test)                                                                | Mike's link opens in the language Sarah wrote in.                                  |
| N4  | P1    | Run `TEST_DATABASE_URL` repository tests against a disposable Neon branch, never prod.                                                                                                                         | `src/server/repo/repository.test.ts`                                                                            | The Postgres contract tests pass and the README says how to run them.              |
| N5  | P1    | README final: screenshots (landing EN/RU, dashboard, sibling phone view), the 30-second demo script, architecture links, test counts.                                                                          | `README.md`, `docs/`                                                                                            | A juror understands the repo in 2 minutes.                                         |
| N6  | P1    | Run docs/REVIEW.md at 08:00 and triage the results into this file.                                                                                                                                             | `docs/TASKS.md`                                                                                                 | Every BLOCKER and HIGH row has an owner.                                           |
| N7  | P2    | Landing polish from the design review: hairline pointers on the labels, and magnet/paper accents in the lower sections.                                                                                        | `src/components/landing/**`                                                                                     | The detector is clean and the reviewer has nothing left above MEDIUM.              |
| N8  | 11:00 | Make the repo public: `gh repo edit Nurasick/kinvoice --visibility public --accept-visibility-change-consequences`. Check that no secrets are in history (GitGuardian is green).                               | –                                                                                                               | The repo opens logged out.                                                         |

## Yernur: caregiver and sibling screens in RU/KZ, dashboard clarity

| #   | P   | Task                                                                                                                                                                                                                                                                              | Files                                                                          | Done when                                                                                                                          |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Y1  | P0  | Translate the sibling page `/i/[token]`: the note frame, "Your part this month", pay buttons, Zelle text, "I've sent it", the breakdown and the invalid-link page. Keep the strings in a dictionary file next to the surface, like `components/landing/copy.ts`. Money stays USD. | `src/app/i/**`, `src/components/public-invoice/**`                             | `/i/<token>?lang=kk` is fully Kazakh at 375px, with nothing in English except names, merchants and "Venmo/PayPal/Zelle".           |
| Y2  | P0  | Dashboard clarity pass (see "Making the dashboard comprehensible" below). Show the progress strip in an empty month too.                                                                                                                                                          | `src/components/dashboard/**`                                                  | A first-time viewer can say within 5 seconds "Sarah paid most; Mike's share is $218.40; the invoice is sent; nobody has paid yet". |
| Y3  | P1  | Translate the caregiver screens: dashboard, invoice composer, settings, setup, the nav, empty/error/404 states.                                                                                                                                                                   | `src/components/{dashboard,invoice,setup,layout}/**`, `src/app/{app,setup}/**` | `?lang=ru` covers the whole caregiver flow, with no layout breaks from long Russian or Kazakh words.                               |
| Y4  | P1  | Verify the Venmo and PayPal deep links on a real phone (the TODO in `src/lib/payments/links.ts`), then remove the TODO.                                                                                                                                                           | `src/lib/payments/links.ts`                                                    | The amount and note are prefilled in the Venmo app on iOS or Android.                                                              |
| Y5  | P2  | Accessibility pass: focus order, visible focus on the enamel header, contrast of `text-ink-muted` on mist, `aria-live` on payment status.                                                                                                                                         | `src/components/ui/**`, screens                                                | Keyboard-only run of the demo path works.                                                                                          |

## Olzhas: AI quality in three languages, log screen

| #   | P   | Task                                                                                                                                                                                                                                                | Files                                                             | Done when                                                                                                         |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| O1  | P0  | Invoice message wording: never list a sibling's $0.00 as "contributed $0.00". Mention a sibling's time instead, or leave it out. Name every suggested contribution exactly once.                                                                    | `src/server/ai/prompts.ts`, `src/server/ai/template.ts` (+ tests) | The demo family's message has no "$0.00" and no "owe", and the template fallback follows the same rule.           |
| O2  | P0  | Quick log in Russian and Kazakh: "Заплатила $86 в CVS за мамины лекарства, потом отвезла её к кардиологу, 3 часа." gives 1 expense and 1 time card, with categories from the enums and notes written in the user's language. Uses `locale` from N1. | `src/server/ai/**`, `src/app/api/ai/quick-log/**`                 | All three demo sentences (EN/RU/KZ) give 2 correct cards 5 out of 5 times, each in under 5 s.                     |
| O3  | P0  | Invoice message in the caregiver's language (`locale` from N1), in all three tones.                                                                                                                                                                 | `src/server/ai/**`, `src/app/api/ai/invoice-message/**`           | A RU and a KZ draft read naturally, quote only the given numbers and say "предлагаемый вклад" / "ұсынылған үлес". |
| O4  | P1  | Translate the log screen: quick-log box, draft cards, manual form, entry list, notices. Use N2's `useLocale()`.                                                                                                                                     | `src/app/app/log/**`, `src/components/log/**`                     | `?lang=kk` log flow works end to end at 375px.                                                                    |
| O5  | P1  | Receipt reading on 3 real receipt photos (pharmacy, grocery, doctor copay) and 1 PDF. Note the accuracy in the PR.                                                                                                                                  | `src/server/ai/**`                                                | The amount is right on all 4. Failures fall back to the prefilled form.                                           |
| O6  | P2  | Latency: log p50/p95 for each AI route on production (server-side, no user text in the logs).                                                                                                                                                       | `src/server/ai/openai.ts`                                         | Numbers in the PR. Nothing above 8 s at p95.                                                                      |

---

## Making the dashboard comprehensible

Skills in Claude Code that help (type `/` in your session to check you have them):

| Skill        | Use it for                                                                                                                                                                                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dataviz`    | Before writing any chart, stat tile or breakdown. It gives a form heuristic (which chart for which question), one colour system for money vs time, stat-tile and legend rules, and accessible contrast. The best fit for "Where it went" and "Who gave what".                                                          |
| `impeccable` | `/impeccable critique src/components/dashboard` for a scored UX review, `/impeccable distill` to cut what doesn't answer a question, `/impeccable layout` for hierarchy and spacing, `/impeccable clarify` for labels and microcopy. The dashboard is an **Operate** surface: precision and restraint, not decoration. |

If a skill is missing in your session, follow these rules directly:

1. **One question per block.** Progress strip = "where am I this month". Who gave what = "is it fair". Where it went = "what did the money pay for". Recent = "did my last entry save". Delete anything that answers none of these.
2. **Lead with the answer, not the metric.** "Sarah carried 88% of the costs this month" beats three equal stat cards.
3. **Same scale, side by side.** Compare siblings on one shared axis (as on the landing's meters), money and time as separate bars, never one combined number.
4. **Colour has meaning.** Cobalt = money, marigold = time / current step, green = settled. No decorative colour.
5. **Numbers:** tabular figures, cents only where they matter, one unit per column.
6. **Check:** 375px with no sideways scroll, and real demo data, not lorem.

---

## Kickoff prompts (paste into your Claude Code session)

### Nurali

```text
Read CLAUDE.md, docs/ROLES.md, docs/TASKS.md (my section: Nurali). git pull main.
Do N1 first in its own small PR (optional locale on QuickLogRequest and InvoiceMessageRequest, frozen
contract, backwards compatible), then N2 and N3. Keep money in USD. Tests for every pure helper.
npm run check before each commit. Then N4-N6. N8 only at 11:00 Nov 15.
```

### Yernur

```text
Read CLAUDE.md, docs/ROLES.md, DESIGN.md, docs/TASKS.md (my section: Yernur). git pull main
(the design system changed today). Do Y1 (sibling page /i in EN/RU/KZ, dictionary next to the
surface like components/landing/copy.ts, use src/lib/i18n) and Y2 (dashboard clarity: use the
dataviz skill and /impeccable critique on src/components/dashboard; follow the rules in TASKS.md).
Then Y3, Y4. Check every screen at 375px and 1440px in all three languages. Never say "owe".
npm run check before each commit. Small PRs to main; Nurali merges.
```

### Olzhas

```text
Read CLAUDE.md, docs/ROLES.md, docs/TASKS.md (my section: Olzhas). git pull main.
Do O1 now (no "$0.00 contributed" lines in invoice messages; template too; tests). When Nurali's N1
is merged, do O2 and O3 (quick log and invoice message in RU/KZ via the optional locale field).
AI never decides money: numbers come only from src/lib/money. Validate all output with Zod; failure
falls back. Then O4, O5. npm run check before each commit. Small PRs to main; Nurali merges.
```

### Reviewer (anyone, at 08:00)

See [REVIEW.md](REVIEW.md).

---

## Review run, Nov 14 evening (N6)

Ran `docs/REVIEW.md` (focus ALL) against production after every round 2 PR merged (#12–#34). Rerun at 08:00 Nov 15 and add new rows here.

**Demo path on production:** landing → Try Sarah's family → Log (the demo sentence) → Confirm all 2 → Invoice → publish → personal link → sibling page → Pay with Venmo → I've sent it → Mark as received ×2 → "everyone has settled". Passes at 1440px and 375px; every step under 5 s (AI quick log ~3 s, AI invoice draft ~3 s); no page errors; no sideways scroll. Every app screen, `/setup`, 404 and `/i` checked in RU and KZ: no English left, never "owe".

| #   | Severity | Finding                                                                                                                              | Owner                                    | Status                                      |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------- |
| R1  | BLOCKER  | Viewing the landing switched the visitor to Kazakh: Next prefetched the `?lang=` switcher links and the proxy saved each as a choice | Nurali                                   | Fixed in #34, verified on prod              |
| R2  | HIGH     | Dashboard said "everyone settled" while still listing suggested contributions                                                        | Nurali, Yernur                           | Fixed in #20 + #26                          |
| R3  | HIGH     | Sibling page listed entries added after publishing, so they didn't sum to the frozen total                                           | Nurali                                   | Fixed in #20                                |
| R4  | HIGH     | AI and demo seed stored a medical specialty ("cardiology")                                                                           | Olzhas, Nurali                           | Fixed in #20                                |
| R5  | HIGH     | Hero copy covered by the receipt and sticky at 1024–1279px (worse in RU)                                                             | Nurali                                   | Fixed in #32                                |
| R6  | MEDIUM   | Non-UUID ids returned 500; sibling could set the "sent" amount; re-publishing reset payments; `<html lang>` always "en"              | Nurali                                   | Fixed in #20, #23                           |
| R7  | MEDIUM   | App English-only after the landing                                                                                                   | Nurali (N2/N3), Yernur (Y3), Olzhas (O4) | Fixed in #23–#30                            |
| R8  | LOW      | Pay links follow Venmo's documented format but were never tapped on a real phone                                                     | Yernur                                   | Open: try once on a phone before 10:00      |
| R9  | LOW      | Repository contract tests only ran in memory                                                                                         | Nurali                                   | Fixed in #31: CI runs them on real Postgres |

Still to do: rerun this at 08:00 (N6), make the repo public at 11:00 (N8).
