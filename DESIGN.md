---
name: Kinvoice
description: One fair monthly care invoice, pinned to the family fridge door.
colors:
  enamel: "#2446a0"
  enamel-deep: "#182f73"
  enamel-hi: "#3a63c8"
  on-enamel: "#ffffff"
  on-enamel-soft: "#d8e1ff"
  marigold: "#ffb81c"
  marigold-deep: "#f0a000"
  tomato: "#e4513b"
  mint: "#4fc59f"
  manila: "#f2e2b3"
  manila-rule: "#c8432f"
  sticky: "#ffdf5e"
  paper: "#ffffff"
  thermal: "#f6f6f2"
  ink: "#161d2c"
  ink-soft: "#465066"
  ink-faint: "#6b7489"
  mist: "#eef2fc"
  line: "#dfe4f0"
typography:
  display:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.9rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  numeral:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 3rem + 6vw, 8rem)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.04em"
  figure:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  body-lede:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"tnum\" 1"
  body:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Golos Text, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
  hand:
    fontFamily: "Caveat, cursive"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.1
  receipt:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  paper: "6px"
  control: "12px"
  button: "14px"
  panel: "16px"
  device: "34px"
  pill: "999px"
spacing:
  gutter-sm: "16px"
  gutter: "32px"
  section: "80px"
  section-lg: "112px"
  container: "84rem"
components:
  button-primary:
    backgroundColor: "{colors.marigold}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "0 1.6rem"
    height: "3.5rem"
  button-primary-hover:
    backgroundColor: "#ffc540"
    textColor: "{colors.ink}"
  button-ink:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.on-enamel}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-ink-hover:
    backgroundColor: "{colors.enamel-deep}"
    textColor: "{colors.on-enamel}"
  button-ghost:
    textColor: "{colors.on-enamel}"
    rounded: "{rounded.button}"
    padding: "0 1.25rem"
    height: "3.5rem"
  pay-button:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.on-enamel}"
    rounded: "{rounded.control}"
    height: "3rem"
  lang-item:
    textColor: "{colors.on-enamel-soft}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.6rem"
  lang-item-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.enamel-deep}"
    rounded: "{rounded.pill}"
  invoice-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "1.5rem 1.5rem 1.25rem"
  read-label:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.paper}"
    padding: "0.3rem 0.6rem"
  artifact-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.25rem"
---

# Design System: Kinvoice

## Overview

**Creative North Star: "The Family Fridge Door"**

The evidence of care already lives on the fridge: a pharmacy receipt, an appointment card, a sticky note from a sibling. Kinvoice's brand world is that door. Deep cobalt appliance enamel is the page itself, with a soft vertical sheen and a fine painted speckle. Real paper objects sit on it, each held by a round enamel magnet, each tilted a few degrees the way a hand pins things up. The white invoice sheet is the largest object and the one everything resolves into.

Between the enamel bands, the page drops to calm paper surfaces (white and cool mist) where the product's artifacts are shown at life size: the quick-log box, the confirmed receipt entry, the sibling's phone. The register stays warm and plain. The world is physical and specific, but the numbers on it are real, set in a heavy rounded display face that makes a dollar figure read at a glance.

**Scope.** This world is built and shipped on the landing page (`/`). It is the new brand direction. The app screens (`/app`, `/setup`, `/i`) still run an older system, recorded under "App surfaces (current)" in each section below; the app may adopt the fridge-door world later. Do not mix the two systems on one surface.

**Key Characteristics:**
- Full-bleed cobalt enamel fields alternate with white and mist paper sections.
- Paper objects are real-object materials (thermal, manila, canary, crisp white), magneted and slightly rotated.
- One marigold action per enamel field.
- Every object Kinvoice reads carries a small printed white label naming what it reads.
- Heavy rounded display type for headings and money; a Cyrillic-first sans for everything else.
- All four faces carry Kazakh Cyrillic; layouts never depend on English string length.

## Colors

A saturated appliance blue, warm paper and three enamel magnet colors: kitchen objects, not UI chrome.

### Primary
- **Cobalt Enamel** (`enamel`): the door. Fills every enamel section and is the color of the ink button, the pay button inside invoices, step numerals, the "Kinvoice" mark on paper, and bold values in read-labels. On paper it is the brand's ink accent.
- **Deep Enamel** (`enamel-deep`): the bottom of the door's sheen gradient, the footer band, ink-button hover, and the active language pill's text.
- **Enamel Highlight** (`enamel-hi`): the top of the sheen gradient; also the magnet color on the sticky note.

### Secondary
- **Marigold Magnet** (`marigold`): the primary action, the logo magnet, the focus ring and text selection. Caregiver time in the meters.
- **Marigold Lip** (`marigold-deep`): the pressed edge under the primary button only.

### Tertiary
- **Tomato Magnet** (`tomato`) and **Mint Magnet** (`mint`): magnet colors. Mint also marks "read" (the read-label dot, confirmed-field checks, the price-line dot).
- **Manila Card** (`manila`) with **Appointment Red Rule** (`manila-rule`): the appointment card and its 6px top rule.
- **Canary Sticky** (`sticky`): the handwritten sticky note.

### Neutral
- **Invoice White** (`paper`): the invoice sheet, read-labels, artifact panels, white sections.
- **Thermal Paper** (`thermal`): receipts only; cooler and greyer than invoice white.
- **Kitchen Ink** (`ink`): primary text on paper, and the text on marigold.
- **Soft Ink** (`ink-soft`): secondary body text and ledes on paper.
- **Faint Ink** (`ink-faint`): captions, sources, field labels. White paper only (about 4.7:1); on mist it falls to about 4.2:1.
- **Kitchen Mist** (`mist`): the light section ground, the "your share" well inside invoices, the quick-log input well.
- **Hairline** (`line`): dividers inside invoices and panels, meter gridlines.
- **On Enamel** (`on-enamel`) and **Soft on Enamel** (`on-enamel-soft`): headline text and secondary text on the door.

Sibling meters pair each caregiver color with a tint for the siblings (cobalt tint `#9fb0dc`, marigold tint `#ffd98a`). Together they keep the fill meaning "same measure, less of it".

### Named Rules
**The One Marigold Rule.** A filled marigold button appears once per enamel field, and only for the primary action. Light sections close with the cobalt ink button instead.

**The Cobalt Shadow Rule.** Every shadow is tinted deep door-navy (`rgb(8 18 48 / …)` or `rgb(24 47 115 / …)`), never neutral black. Objects sit on blue enamel, so their shadows are blue.

### App surfaces (current)
Warm paper `#faf7f2` / `#f2ede4` / `#fffdf9`, ink `#1f2a2e` / `#3d4a4f` / `#6b7471`, lines `#e4ddd1` / `#cfc6b7`, a single sage accent `#3f6f63` (strong `#2f574d`, soft `#e3ece7`), and muted status pairs (success `#3c7a55`, warning `#9a6a1f`, danger `#a4473d`, each with a soft tint). Defined as Tailwind `@theme` tokens in `src/app/globals.css`; components use the token names, never raw hex.

## Typography

**Display Font:** Unbounded (500, 700), falling back to ui-sans-serif, system-ui
**Body Font:** Golos Text (400, 500, 600), falling back to ui-sans-serif, system-ui
**Handwriting:** Caveat (600), sticky notes and hand-written card entries only
**Receipt Mono:** JetBrains Mono (400, 600), thermal receipts only

**Character:** Unbounded is wide, round and heavy, like lettering on an enamel sign; it carries headlines and every money figure. Golos Text was built for Cyrillic interfaces and keeps RU and KZ copy as even as English. Tabular numerals are on for the whole world.

### Hierarchy
- **Display** (700, 2rem at phone, 2.75rem at sm, 2.9rem at lg; 1.1): the hero headline in white on enamel, balanced wrapping, max about 36rem.
- **Headline** (700, 1.875rem rising to 2.6rem at sm; 1.25): section headings.
- **Title** (700, 1.5rem): step titles and pricing sub-heads.
- **Numeral** (700, `clamp(4.5rem, 3rem + 6vw, 8rem)`, 0.8, -0.04em, cobalt): the big step numbers in "how it works".
- **Figure** (700, 2.6rem in the invoice, 3.75rem for price, 1.875rem on the phone; 1): money amounts.
- **Body lede** (400, 1.125rem, 1.625): sub-headlines and section intros, max 31rem or `max-w-md`.
- **Body** (400, 1rem, 1.5): running text.
- **Label** (600, 0.75rem): read-labels, invoice metadata. The language pills use 0.8125rem with 0.04em tracking.
- **Hand** (Caveat 600, 1.45rem, 1.1): the sticky note; 1.5rem for the hand-written appointment time.
- **Receipt** (JetBrains Mono, 0.75rem, 1.5): receipt lines; 0.6 to 0.8rem for headers and footers.

### Named Rules
**The Real Object Type Rule.** Caveat appears only where a hand wrote, and JetBrains Mono only where a thermal printer printed. Neither ever sets UI, headings or body copy.

**The Heavy Money Rule.** Every dollar figure that matters (the suggested contribution, the price, a drafted amount) is set in Unbounded bold. Ledger rows inside a sheet use Golos 600.

### App surfaces (current)
Inter (`--font-sans`) for UI and Fraunces (`--font-display`, optical sizing) for display. Latin subset only; it does not yet carry Cyrillic.

## Layout

A centered container (`container`, 84rem) with 16px gutters on phones and 32px from `sm`. Sections stack full-bleed and alternate ground: enamel hero, white problem section, mist steps, enamel pricing, white trust, mist close, deep-enamel footer. Vertical rhythm is 80px per section, 112px at `lg` (the trust section uses 96px).

The hero is a free composition on the door rather than a column split. Copy holds the left (max 36rem) and the scene is absolutely placed from 46% to the right edge at `lg`, its objects at fixed positions and widths. Below `lg` the scene becomes a fixed 780px-tall, 440px-wide stage under the copy. The door handle shows only at `lg`.

"How it works" alternates text and artifact in a two-column grid at `lg`, flipping the middle step. The problem section pairs a 26rem text column with three identical meter columns. Trust points are a three-column list with 2px ink top rules, not cards.

Breakpoints are Tailwind's defaults (`sm` 40rem, `lg` 64rem). The hero's minimum height is `min(54rem, 100svh)` at `lg`.

### Named Rules
**The Same Scale Rule.** When siblings are compared, every person gets an identical meter on one shared scale (180px track, 36px gridlines). The imbalance has to read in one sweep, never from a legend.

## Elevation & Depth

This world is physically layered. Paper objects lift off the enamel with a three-layer drop shadow. Magnets are glossy domes with a specular dot, an inner bottom shade and a cast shadow. The primary button has a pressed lip that deepens on hover and compresses on press. Light-section panels carry one long, soft cobalt shadow. The rest is flat: invoices on paper sections, trust lists and meters all sit flat.

### Shadow Vocabulary
- **Paper lift** (`0 1px 1px rgb(8 18 48 / 0.18), 0 18px 30px -14px rgb(8 18 48 / 0.6), 0 34px 60px -30px rgb(8 18 48 / 0.55)`): every paper object, on enamel or off.
- **Magnet** (`0 6px 8px -2px rgb(8 18 48 / 0.45), inset 0 -3px 4px rgb(0 0 0 / 0.22), inset 0 2px 2px rgb(255 255 255 / 0.35)`): magnets and the logo magnet.
- **Read-label** (`0 8px 16px -8px rgb(8 18 48 / 0.6)`): printed labels.
- **Marigold press** (`0 2px 0 #f0a000, 0 14px 28px -10px rgb(10 20 60 / 0.55)`; 4px lip on hover, 1px on active): primary button only.
- **Ink button** (`0 12px 24px -12px rgb(24 47 115 / 0.7)`).
- **Artifact panel** (`0 24px 48px -28px rgb(24 47 115 / 0.45)`) and **Device** (`0 30px 60px -28px rgb(8 18 48 / 0.6)`).
- **Enamel well** (`rgb(8 20 60 / 0.28)` fill, with `inset 0 1px 2px rgb(0 0 0 / 0.25)` on the language switch): recessed areas on the door (language switch, price line, siblings-free panel).

### Named Rules
**The Magnet Holds It Rule.** A paper object on enamel is always held by a round magnet (26px, centered on its top edge). Paper never floats on the door unpinned.

### Motion
Entrances use one curve, `cubic-bezier(0.16, 1, 0.3, 1)`. Scraps snap onto the door one by one (760ms, 160ms stagger, falling 28px with extra rotation). Each magnet clacks on 400ms after its object, and the labels rise in last. The invoice lands last. Meters rise on scroll through a view timeline (1100ms). With a fine pointer, objects parallax by depth (`--d` from 3 to 9). Parallax is off for touch and reduced motion, and the global reduced-motion rule collapses every animation.

### App surfaces (current)
Near-flat: one card shadow (`0 1px 2px rgb(31 42 46 / 0.04), 0 4px 16px rgb(31 42 46 / 0.04)`) and `shadow-sm` on the primary button.

## Shapes

Paper is paper: the invoice and read-labels have barely rounded 6px corners, while the receipt, manila card and sticky note are square. Receipts end in a torn zigzag (12px teeth). The manila card carries a 6px red top rule, and the sticky note curls at its bottom corner. Pinned objects rotate between -4deg and 4deg; the pricing sheet tilts -1deg.

Controls are softer: 14px buttons, 12px pay buttons and inner wells, 16px artifact panels, 34px phone body with a 26px screen. Pills (999px) are reserved for the language switch, the price line and the first-month offer. Circles are for magnets and status dots.

### App surfaces (current)
`--radius-card` 1rem, `--radius-control` 0.625rem.

## Components

### Buttons
Tactile and confident: a button is a thing you press.
- **Shape:** gently rounded (14px), 56px tall for the primary, 52px for ink.
- **Primary (marigold):** marigold fill, ink text, Golos 600 at 1.0625rem, trailing arrow, pressed lip (see Elevation). Hover lightens to `#ffc540` and lifts 2px. Active presses down 1px. While loading it sets `aria-busy`, shows 85% opacity and a progress cursor, and swaps its label.
- **Ink:** cobalt fill, white text, soft cobalt shadow. Hover goes to deep enamel and lifts 2px. Used on light sections and inside the pricing sheet.
- **Ghost (on enamel):** white text with a 45%-white underline at 6px offset. On hover the underline turns marigold.
- **Focus (all):** a 3px marigold outline at 3px offset.

### Pay Button (inside artifacts)
A static cobalt bar, 48px tall with 12px corners and white Golos 600 text. It stands for the sibling's pay action inside invoice and phone illustrations, and is not a live control on the landing page.

### Navigation: Language Switch
A recessed enamel-well pill (3px inset) holding EN / RU / KZ items in Golos 600 at 0.8125rem with 0.04em tracking, in soft-on-enamel. Hover turns white. The current item becomes a white pill with deep-enamel text. The logo is a marigold magnet with "K" in Unbounded, next to the wordmark in Unbounded 700 at 1.25rem.

### Invoice Sheet (signature)
Crisp white, 6px corners, paper lift. The header shows the month title in Unbounded and the "Kinvoice" mark in cobalt above a hairline. Ledger rows follow in Golos, then a mist well holding "your share" and the figure, then the pay button and a faint foot line.

### Read-Labels (signature)
Small white printed labels (6px corners, label type) with a 7px mint dot and the read value in bold cobalt. They overhang the bottom edge of the object they describe.

### Paper Objects (signature)
Thermal receipt (thermal, mono, dashed dividers, torn edge), manila appointment card (red top rule, uppercase tracked letterhead printed on the card, hand-written time in blue Caveat), canary sticky note (Caveat, curl). Each object is pinned with a magnet. Tomato, mint, enamel-hi and marigold are the magnet colors in use.

### Artifact Panels
White, 16px corners, 20px padding, long soft cobalt shadow, max about 28rem. Inner fields use 12px corners with hairline borders. Confirmed fields carry a mint check.

### Meters
A 180px track on `#f7f9fe` with hairline gridlines every 36px and 10px corners. The fill is inset 18% on each side with 8px top corners and grows from the bottom.

### App surfaces (current)
Button variants primary (sage), secondary (surface with strong line), ghost and danger, in sm/md/lg sizes (32/40/48px) with control radius and Inter 500. A 2px sage focus outline.

## Do's and Don'ts

### Do:
- **Do** make enamel a full-bleed section ground with its sheen and speckle; the door is the page, never a card.
- **Do** hold every paper object on enamel with a magnet and tilt it a few degrees (-4deg to 4deg).
- **Do** keep to one marigold button per enamel field; use the cobalt ink button on light sections.
- **Do** tint shadows door-navy (`rgb(8 18 48 / …)`).
- **Do** set money figures in Unbounded bold, using the real numbers from the demo seed.
- **Do** label what Kinvoice reads from an object with a white read-label, mint dot and bold cobalt value.
- **Do** load all four faces with Cyrillic and Cyrillic-ext subsets and test RU and KZ string lengths.

### Don't:
- **Don't** use Caveat or JetBrains Mono for UI, headings or body; they belong to handwriting and receipts.
- **Don't** put Faint Ink (`ink-faint`) text on mist; keep it on white paper.
- **Don't** use neutral black shadows or flat grey drop shadows in this world.
- **Don't** set uppercase tracked eyebrows above headings. Uppercase tracking is only for print on a paper object (letterhead, receipt header).
- **Don't** bring the app's sage accent, Inter or Fraunces onto fridge-door surfaces, or fridge-door enamel and marigold onto current app screens, until the app adopts this world.
