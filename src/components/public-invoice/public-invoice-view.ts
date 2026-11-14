/**
 * Display helpers for the sibling's public invoice. Pure; amounts come from the frozen snapshot
 * and the month's entries, never recomputed here.
 */
import type {
  Entry,
  ExpenseEntry,
  MemberBalance,
  PaymentMark,
  PublicInvoice,
  TimeEntry,
} from "@/shared/domain";
import { monthName } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";

export interface ExpenseGroup {
  category: string;
  totalCents: number;
  entries: ExpenseEntry[];
}

/** Expenses grouped by category, biggest group first; entries inside by date. */
export function groupExpenses(entries: readonly Entry[]): ExpenseGroup[] {
  const groups = new Map<string, ExpenseEntry[]>();
  for (const e of entries) {
    if (e.kind !== "expense") continue;
    groups.set(e.category, [...(groups.get(e.category) ?? []), e]);
  }
  return [...groups.entries()]
    .map(([category, list]) => ({
      category,
      totalCents: list.reduce((sum, e) => sum + e.amountCents, 0),
      entries: [...list].sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .sort((a, b) => b.totalCents - a.totalCents || a.category.localeCompare(b.category));
}

/** Time entries, oldest first. */
export function timeEntries(entries: readonly Entry[]): TimeEntry[] {
  return entries
    .filter((e): e is TimeEntry => e.kind === "time")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function siblings(invoice: PublicInvoice): MemberBalance[] {
  return invoice.snapshot.members.filter((m) => m.role === "sibling");
}

export function caregiverBalance(invoice: PublicInvoice): MemberBalance | undefined {
  return invoice.snapshot.members.find((m) => m.role === "caregiver");
}

export function paymentFor(invoice: PublicInvoice, memberId: string): PaymentMark | undefined {
  return invoice.payments.find((p) => p.memberId === memberId);
}

/** Which sibling to preselect: the remembered one if still valid, or the only sibling. */
export function initialSibling(invoice: PublicInvoice, remembered: string | null): string | null {
  const list = siblings(invoice);
  if (remembered && list.some((m) => m.memberId === remembered)) return remembered;
  return list.length === 1 ? list[0].memberId : null;
}

const INTL_TAG: Record<Locale, string> = { en: "en-US", ru: "ru-RU", kk: "kk-KZ" };

/** "2026-11" → "November 2026" / "Ноябрь 2026" / "Қараша 2026". */
export function monthYear(month: string, locale: Locale): string {
  const [y, m] = month.split("-").map(Number);
  return `${monthName(new Date(Date.UTC(y, m - 1, 1)), locale)} ${y}`;
}

/** "2026-11-14" → "Sat, Nov 14" / "сб, 14 нояб." in the reader's language (no timezone shift). */
export function dayLabel(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(INTL_TAG[locale], {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
