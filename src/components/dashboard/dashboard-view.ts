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

export function isEmptyMonth(balance: MonthlyBalance): boolean {
  return balance.totalOutOfPocketCents === 0 && balance.totalMinutes === 0;
}

/** Current local month, "YYYY-MM". */
export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Whoever paid the most this month, and their share of the total (display only, rounded). */
export interface LeadPayer {
  name: string;
  role: MemberBalance["role"];
  /** 0..100, rounded to a whole percent */
  sharePct: number;
}

export function leadPayer(balance: MonthlyBalance): LeadPayer | null {
  const total = balance.totalOutOfPocketCents;
  if (total === 0) return null;
  const top = orderedMembers(balance).reduce((a, b) => (b.paidCents > a.paidCents ? b : a));
  return { name: top.name, role: top.role, sharePct: Math.round((top.paidCents / total) * 100) };
}

export interface MemberMeter {
  member: MemberBalance;
  /** 0..1 of the month's total costs: every row on the same scale */
  moneyFraction: number;
  /** 0..1 of the month's total care time: every row on the same scale */
  timeFraction: number;
}

/** One row per member, caregiver first, bars sized against the month's totals (not the row max). */
export function memberMeters(balance: MonthlyBalance): MemberMeter[] {
  const money = balance.totalOutOfPocketCents;
  const time = balance.totalMinutes;
  return orderedMembers(balance).map((member) => ({
    member,
    moneyFraction: money === 0 ? 0 : member.paidCents / money,
    timeFraction: time === 0 ? 0 : member.minutes / time,
  }));
}

/** Siblings with something suggested, in member order. */
export function suggestedSiblings(balance: MonthlyBalance): MemberBalance[] {
  return orderedMembers(balance).filter((m) => m.role === "sibling" && m.suggestedContributionCents > 0);
}
