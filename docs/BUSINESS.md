# Kinvoice: the business case

For the pitch (15% business, 20% value and retention). Every number is either **sourced** (link below) or **arithmetic** on a stated assumption. Nothing here is a forecast or a traction claim. We have no users yet, so we never say we do.

## 1. The model in one line

**The caregiver pays $5.99/month. Siblings are always free. The first month is free.**

The person with the pain pays. Siblings never sign up, so they never become a reason not to buy.

## 2. The problem in numbers (all sourced)

| Fact | Source |
|---|---|
| **63 million** Americans are family caregivers, up about 45% in a decade. 1 in 4 adults. | AARP + National Alliance for Caregiving, *Caregiving in the US 2025* (Jul 2025) [1] |
| **One-third** have been caregiving for **5+ years**. | same [1] |
| Only **1 in 10** families share parent care equally among siblings. **40%** say siblings don't help at all; another **41%** say they help, but not enough. | Northwestern Mutual C.A.R.E. Study, Harris Poll, n=1,400 (2019) [2] |
| **69%** of adults sharing parent care have fought with a sibling over it. **Money is the #1 trigger (36%)**, ahead of the time/effort imbalance (26%). | Bay Alarm Medical, *The Sibling Scorecard* [3] |

Say "2019" for the Northwestern Mutual study if asked. It is the most-cited source on this, but it isn't new.

**The pitch sentence:** 63 million caregivers. In 9 of 10 families the load isn't shared. Money is what siblings fight about. Kinvoice makes the money visible and easy to settle, without a fight.

## 3. Market size (arithmetic, assumptions labeled)

| Layer | Count | How |
|---|---|---|
| All US family caregivers | 63M | sourced [1] |
| Caregivers with siblings where the load is uneven | about 40M | 63M × 83% have siblings [2] × 81% get no or not enough sibling help [2]. **Assumption:** the 2019 shares apply to the 2025 count. |
| **$100M ARR needs** | **1.39M paying caregivers** | $100M ÷ ($5.99 × 12 = $71.88/yr) |
| …as a share of the 63M | **2.2%** | 1.39M ÷ 63M |

The line to use: "$100M ARR is about 2% of America's family caregivers. That is arithmetic, not a forecast."

## 4. Unit economics (arithmetic, assumptions labeled)

| Item | Per caregiver per month |
|---|---|
| Price | $5.99 |
| Card fees (2.9% + $0.30, typical Stripe US) | about $0.47 |
| AI + hosting | cents. About 30 short AI calls a month on a small model (quick log ~3 s, invoice draft ~2 s in production). **Measure this before quoting a number.** |
| **Gross margin** | **about 85–90%** after fees and infrastructure (assumption) |

**LTV** = monthly gross profit ÷ monthly churn. **Assumption:** about $5.10 gross profit/month.

| Monthly churn (assumption) | Average lifetime | LTV |
|---|---|---|
| 6% | about 17 months | about $85 |
| 4% | 25 months | about $127 |

Why churn can be low: care goes on for years (a third of caregivers are at 5+ years [1]), and every month needs a new invoice.

**CAC ceiling at LTV:CAC = 3:1 → $28–42 per paying caregiver.** That sets the channel plan: organic, referral and partner channels first; paid ads only where they stay under that ceiling.

**Optional upsell later (not built):** an annual plan at $49/yr cuts card fees and churn.

### Trial → paid (public benchmark, as the FAQ asks)

RevenueCat's *State of Subscription Apps 2025* found that **longer trials (17–32 days) convert best, at 45.7%** median trial-to-paid [9]. Our free first month (30 days) sits in that band. **Assumption:** we plan on a third of that (15%) until we have our own data.

### CAC by channel (assumptions, to test, not measured)

| Channel | How it works | CAC assumption | Why |
|---|---|---|---|
| Sibling invoice link (built in) | Siblings see the branded page and some start their own | about $0 | No spend; costs only the hosting |
| Search content ("split caregiving costs with siblings") | Free guide plus a one-click demo | $10–20 | Writing costs only; the demand already exists [5][6] |
| Partners (care managers, elder-law, home-care agencies) | Referral, e.g. a free month for their clients | $15–25 | A referral fee per paying caregiver |
| Paid social (Facebook/Instagram, women 35–45 caring for a parent) | Ad → demo → free month | $40–60 | Only scaled if payback stays under 12 months |
| **Blended target** | | **under $35** | Stays under the $28–42 ceiling from LTV:CAC 3:1 |

Payback at $35 CAC and about $5.10 gross profit/month ≈ **7 months**.

## 5. How we acquire users

1. **The product spreads itself.** Every invoice lands on 2+ siblings' phones as a branded page, right when they're thinking about a parent's care. Siblings are often caregivers for an in-law or another parent too. The page footer is the referral channel. It costs nothing.
2. **Search intent already exists.** AARP, Bankers Life, Next Avenue and others publish "how to split caregiving costs with siblings" guides [5][6]. People search for this. We publish the useful version (a free one-month care invoice) and convert from there.
3. **Communities where caregivers already are:** caregiver Facebook groups, Reddit (r/AgingParents, r/caregivers), and AARP-adjacent content.
4. **Partners who meet the caregiver at the start:** geriatric care managers, elder-law attorneys, Area Agencies on Aging, home-care agencies. They see sibling money fights every week.
5. **Later, B2B2C:** employer caregiving benefits. The AARP 2025 report tracks how caregiving benefits are growing at work [1]. This is roadmap, not the 24-hour MVP. The product stays B2C.

## 6. Competition: everyone else needs the whole family in the app

| | Who has to join | What it is |
|---|---|---|
| **SplitKin** [4] | Every sibling. Its AI reads the siblings' shared chat. | Shared caregiving space: logs, contributions, decisions. One paid account covers all siblings, billed yearly. |
| **CareShare** [7] | Family members are invited by email | Shared calendar, tasks, expenses, messaging |
| **SupportPay** [8] | Everyone in the app | General expense splitting, including eldercare. Free in the App Store. |
| **Splitwise / Venmo requests / a spreadsheet** | Everyone, or nobody sees context | Generic. No time shown, no care story, and "you owe" framing. |
| **Kinvoice** | **Only the caregiver.** Siblings get a link. | One monthly care invoice: money **and** time, a suggested contribution, one-tap pay |

**Our bet:** in the families that need this most, the siblings who aren't helping are exactly the ones who won't install an app. A tool that needs their sign-up fails where it matters. Kinvoice works with zero buy-in from them.

Before quoting a competitor's price on stage, open their pricing page. I couldn't confirm SplitKin's $4.99/mo from public pages. SplitKin's site says "one paying account covers all siblings, billed yearly". Safer wording: "SplitKin and CareShare need every sibling to join".

## 7. Why it is defensible

- **The opposite architecture.** Competitors are built on shared accounts. Copying "no sibling accounts" means rebuilding their model.
- **History is a switching cost.** Months of entries, invoices and who-paid-what become the family's record. Nobody wants to rebuild that.
- **Trust design is a feature.** AI drafts but never decides money; nothing is sent without a click; there are no medical records. That makes it safe to send to family.
- **Honest:** the code is copyable. The moat is the habit and the record, so retention matters (next section).

## 8. Retention: why Sarah comes back next month

### What already pulls her back (say this)
- **The bill comes every month.** Care costs recur, so the invoice recurs. It's a monthly ritual, like rent.
- **Open money loops.** "0 of 2 settled → 2 of 2 settled" makes her check back until everyone has paid.
- **The record builds.** Each month adds to the family's history. Leaving means losing it.
- **Care lasts for years** (a third of caregivers are at 5+ years [1]). The job outlasts any one month.

### What to do about it

**Tonight, before the 10:00 freeze, only if it's small and safe:** add a "next month" state to the settled dashboard. Pure copy plus a link, no new backend:
> "November is settled. December starts fresh: log things as they happen, and your invoice will be ready to draft on the 1st." **[Log the first one]**

That one line shows the jury the monthly loop on screen.

**Roadmap, in order of retention impact (say these, don't build them tonight):**
1. **The "1st of the month" email:** "Your December care invoice is ready to review." It's the habit trigger: draft from the month's entries, one click to send.
2. **Siblings add their own receipts from the same link.** Siblings come back too, and the shares fix themselves.
3. **A gentle nudge for unsettled siblings** (caregiver-approved, never "you owe"): "Mike hasn't marked November yet. Send a friendly reminder?"
4. **A year-end care summary:** what each sibling gave in money and time. Useful for a family meeting or taxes, and a reason never to switch tools.
5. **Recurring entries:** the home aide every Thursday, the monthly prescription. Less typing, and a reason to keep the account.

### Retention metrics we'd track (no numbers yet, say what you'd measure)
- **Month-2 retention:** % of caregivers who publish a second invoice. This is the number that proves the business.
- **Settle rate:** % of invoices where every sibling marks "sent" within 7 days. This is the value metric.
- **Time to settle:** days from publish to "everyone settled".

## 9. Business Q&A (short answers)

**"Why pay $5.99 when Splitwise is free?"** Splitwise needs Mike to install it and says "you owe". Kinvoice gets Mike to pay without installing anything, and it shows Sarah's 19 hours next to the money. The one-tap settle is what she pays for.

**"Why wouldn't siblings pay?"** On purpose: the person with the pain pays. Free siblings means no barrier on the side that's least motivated.

**"What's your CAC?"** No real CAC yet; we haven't launched. With LTV around $85–127, the ceiling at 3:1 is about $30–40, so we start with organic channels: the invoice link itself, search intent, and caregiver communities.

**"Is this big enough?"** 63M caregivers, growing about 45% in a decade. $100M ARR is about 2% of them.

**"What if a big player adds this?"** Their products are built on everyone joining. Ours works when siblings won't. Our edge is focus plus the family's record.

**"Why would a Kazakhstan team win the US market?"** The problem is universal (the app already runs in EN/RU/KZ), the product is web-only, and payments go through the family's own Venmo, PayPal or Zelle, so we hold no money and need no US banking setup on day one.

## 10. Slide-ready version (for the Business slide)

> **Business model**
> - Caregiver: **$5.99/mo**, first month free · Siblings: **always free**
> - ~85–90% gross margin; AI costs cents per caregiver per month
> - **$100M ARR = 1.39M caregivers ≈ 2% of 63M** *(arithmetic, not a forecast)*
> - Growth loop built in: every invoice reaches 2+ siblings via a branded link
> - Retention: care lasts years (⅓ are 5+ years in) → a monthly invoice ritual

## Sources

1. AARP & NAC, *Caregiving in the US 2025*: https://www.aarp.org/press/releases/2025-07-24-new-report-reveals-crisis-point-for-americas-63-million-family-caregivers.html · https://www.aarp.org/caregiving/basics/caregiving-in-us-survey-2025/
2. Northwestern Mutual 2019 C.A.R.E. Study: https://news.northwesternmutual.com/2019-04-03-Northwestern-Mutual-Study-Caring-for-Aging-Parents-is-Not-a-Family-Affair
3. Bay Alarm Medical, *The Sibling Scorecard*: https://bayalarmmedical.com/caregiver-support/the-sibling-scorecard/
4. SplitKin: https://splitkin.com/
5. AARP, *10 Tips for Splitting Caregiving Costs Among Siblings*: https://www.aarp.org/caregiving/financial-legal/how-to-split-caregiving-costs-with-family/
6. Bankers Life, *How to fairly split your parent's caregiving costs*: https://www.bankerslife.com/insights/personal-finance/how-to-fairly-split-your-parents-caregiving-costs-among-siblings/
7. CareShare features: https://careshare.vercel.app/features
8. SupportPay (App Store): https://apps.apple.com/us/app/id808332758
9. RevenueCat, *State of Subscription Apps 2025*: https://www.revenuecat.com/state-of-subscription-apps-2025
