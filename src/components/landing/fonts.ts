/**
 * Landing faces, all with Kazakh Cyrillic. Self-hosted by next/font (options must be literals).
 * Unbounded: display. Golos Text: body (built for Cyrillic UI). Caveat: handwriting on the sticky note only.
 * JetBrains Mono: the thermal receipt only, where a monospace face is the real object's type.
 */
import { Caveat, Golos_Text, JetBrains_Mono, Unbounded } from "next/font/google";

export const display = Unbounded({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-kv-display",
  weight: ["500", "700"],
});
export const body = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-kv-body",
  weight: ["400", "500", "600"],
});
export const hand = Caveat({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-kv-hand",
  weight: ["600"],
});
export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-kv-mono",
  weight: ["400", "600"],
});

export const landingFontVars = [display.variable, body.variable, hand.variable, mono.variable].join(" ");
