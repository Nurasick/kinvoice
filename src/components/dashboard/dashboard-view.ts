/**
 * Display helpers for the dashboard. Pure, no money math: every number comes from
 * MonthlyBalance (computed by lib/money). These only sort and size things for display.
 */
import type { MemberBalance, MonthlyBalance } from "@/shared/domain";

export interface CategoryRow {
  category: string;
  /** cents for expense categories, minutes for time categories */
  value: number;
  /** 0..1 of the largest row, for bar widths only */
  barFraction: number;
}

/** Non-zero categories, largest first, with bar widths relative to the largest. */
export function categoryRows(byCategory: Readonly<Partial<Record<string, number>>>): CategoryRow[] {
  const rows = Object.entries(byCategory)
    .filter((e): e is [string, number] => typeof e[1] === "number" && e[1] > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = rows[0]?.[1] ?? 0;
  return rows.map(([category, value]) => ({ category, value, barFraction: max === 0 ? 0 : value / max }));
}

/** Caregiver first, then siblings in their original order. */
export function orderedMembers(balance: MonthlyBalance): MemberBalance[] {
  const caregiver = balance.members.filter((m) => m.role === "caregiver");
  const siblings = balance.members.filter((m) => m.role === "sibling");
  return [...caregiver, ...siblings];
}

/** Sum of siblings' suggested contributions (what the caregiver would get back). */
export function totalSuggestedCents(balance: MonthlyBalance): number {
  return balance.members.reduce((sum, m) => sum + m.suggestedContributionCents, 0);
}

export function isEmptyMonth(balance: MonthlyBalance): boolean {
  return balance.totalOutOfPocketCents === 0 && balance.totalMinutes === 0;
}

/** Current local month, "YYYY-MM". */
export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
