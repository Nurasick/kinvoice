/**
 * Deterministic invoice message — the fallback when AI is unavailable. Owner: Olzhas.
 * Uses only numbers from the computed balance, never "$0.00". Wording: template-copy.ts.
 */
import type { MonthlyBalance } from "@/shared/domain";
import { formatCents, formatMinutes } from "@/lib/money";
import { formatDuration, monthName as localMonthName } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import { TEMPLATE_COPY } from "./template-copy";
import type { InvoiceMessageInput } from "./types";

function firstOfMonth(month: string): Date {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
}

/** "2026-11" → "November" (English; used in prompts). */
export function monthName(month: string): string {
  return firstOfMonth(month).toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

/** "Mike: $120.00, Emily: $338.40" — only siblings with something to contribute. */
function contributions(balance: MonthlyBalance): string {
  return balance.members
    .filter((m) => m.role === "sibling" && m.suggestedContributionCents > 0)
    .map((m) => `${m.name}: ${formatCents(m.suggestedContributionCents)}`)
    .join(", ");
}

function duration(minutes: number, locale: Locale): string {
  return locale === "en" ? formatMinutes(minutes) : formatDuration(minutes, locale);
}

export function templateInvoiceMessage(input: InvoiceMessageInput, locale: Locale = "en"): string {
  const { tone, parentName, caregiverName, balance } = input;
  const copy = TEMPLATE_COPY[locale];
  const asks = contributions(balance);
  const siblings = balance.members.filter((m) => m.role === "sibling").map((m) => m.name);
  return copy.tones[tone]({
    greeting: copy.hi(siblings),
    month: locale === "en" ? monthName(balance.month) : localMonthName(firstOfMonth(balance.month), locale),
    parent: parentName,
    sum: copy.totals(
      balance.totalOutOfPocketCents > 0 ? formatCents(balance.totalOutOfPocketCents) : null,
      balance.totalMinutes > 0 ? duration(balance.totalMinutes, locale) : null,
    ),
    ask: asks ? copy.ask(asks) : copy.noAsk,
    caregiver: caregiverName,
  });
}
