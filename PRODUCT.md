# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary (the buyer):** the "default caregiver" sibling, typically a woman aged 35–45, who lives closest to an aging parent in the US. She pays for meds, copays and groceries, drives to appointments and handles the paperwork, often while working full time with kids. Her siblings live in other cities and help little, mostly because they don't see what the care involves. Persona: Sarah, 39, Columbus OH; Mom (Linda), 71; Mike in Denver, Emily in Atlanta.
- **Secondary (never signs up):** her siblings. They only open a link, see the month, and pay a suggested contribution.
- **Evaluators right now:** a hackathon jury in Kazakhstan (Business Cup 2.0, Nazarbayev University). They must understand and use the product with no sign-up, in English, Russian or Kazakh.

## Product Purpose

Kinvoice turns the unpaid care one sibling gives an aging parent into a clear monthly "care invoice". The caregiver logs costs and time in plain sentences or receipt photos. Kinvoice adds up the month, and she sends one link. Her siblings open it with no account, see what care cost and who gave money and time, and pay their suggested contribution in one tap (Venmo or PayPal deep link, or Zelle instructions).

Success: siblings actually see the load and chip in, without a fight. Money is the main cause of sibling conflict over parent care.

## Positioning

Built for families where the siblings **won't** join an app. Competitors (SplitKin $4.99/mo, CareShare) need every sibling in a shared space. In Kinvoice the caregiver is the only user, and siblings only ever receive a link. Time is shown next to money, valued at an hourly rate but kept out of the split.

## Operating Context

- **Monthly ritual:** log during the month (one sentence or a receipt photo at a time), then at month end publish the invoice and send the link through whatever the family already uses (text, WhatsApp, email).
- **Siblings** open the link on their phones, often in a messaging app's in-app browser.
- **Payment** happens in the sibling's own Venmo, PayPal or Zelle. Kinvoice never processes money.

## Capabilities and Constraints

- Family setup; AI quick log (one sentence → expense and time drafts); AI receipt reading (photo or PDF); a deterministic balance dashboard; an AI-drafted invoice message with warm, brief or direct tones; a published no-login invoice link; pay deep links; "I've sent it" and "mark as received".
- No login anywhere: the caregiver holds an unguessable edit link, and siblings get a separate read-only link. Demo mode: "Try Sarah's family" creates a private copy of a realistic month.
- AI never decides money. Totals and splits come from tested code; AI output is always a draft the caregiver confirms.
- Money in USD integer cents (US product), even when the UI is in Russian or Kazakh.
- **Pricing (confirmed 2026-11-14):** siblings are always free; the caregiver pays **$5.99/month**. A free first month is shown as the offer. Not yet implemented as billing.
- **Languages:** English (default), Russian and Kazakh. Landing first, the rest of the app later through the same dictionary.

## Brand Commitments

- Name: Kinvoice. Copy says **"suggested contribution"**, never "owe", "debt" or "pay me".
- Voice: calm, warm, plain-spoken and trustworthy. This is family and money; no guilt, no hype.
- Privacy: amounts, categories and short notes only. No medical records, no passwords, no accounts.

## Evidence on Hand

- A real working product in production, with the demo family's real month (`src/server/seed/demo-family.ts`): total $1,015.19, Sarah paid $895.19 and gave 16h, Mike's suggested contribution is $218.40.
- Market data (for the pitch): 63M US family caregivers (AARP 2025); only 1 in 10 families share care equally, and 40% of caregivers get no sibling help (Northwestern Mutual); 69% of adults sharing parent care fought with siblings, with money the #1 cause (Bay Alarm Medical).
- **None** of these exist yet, and none may be invented: testimonials, user counts, press, partner logos, ratings.

## Product Principles

1. **The caregiver is the only user.** Never ask siblings to sign up for anything.
2. **Show, don't claim.** Real numbers from real (demo) data beat adjectives.
3. **Visible, not guilt-trippy.** Make the load visible; the tone stays kind.
4. **Code decides money; AI finds words.**
5. **Zero friction to value.** One click into a working demo, with no sign-up.

## Accessibility & Inclusion

The audience includes 35–60 year-olds on phones, so readable type sizes, strong contrast, and full function on a 375px screen. Respect reduced motion. Copy must work in English, Russian and Kazakh, so layouts can't depend on English string lengths.
