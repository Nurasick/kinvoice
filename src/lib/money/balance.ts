/**
 * Monthly balance — pure, deterministic, no I/O. Owner: Nurali.
 * AI never touches these numbers (brief §2 "AI rules").
 */
import type {
  Entry,
  ExpenseCategory,
  Member,
  MemberBalance,
  MonthlyBalance,
  TimeCategory,
} from "@/shared/domain";
import { timeValueCents } from "./cents";
import { splitEqually } from "./split";

export interface BalanceInput {
  month: string; // YYYY-MM
  members: readonly Member[];
  entries: readonly Entry[];
  hourlyRateCents: number;
}

/** True when an entry's date (YYYY-MM-DD) falls in `month` (YYYY-MM). */
export function isInMonth(date: string, month: string): boolean {
  return date.slice(0, 7) === month;
}

/** Caregiver first, then siblings in their given order. */
function orderMembers(members: readonly Member[]): Member[] {
  return [
    ...members.filter((m) => m.role === "caregiver"),
    ...members.filter((m) => m.role !== "caregiver"),
  ];
}

function addTo<K extends string>(map: Partial<Record<K, number>>, key: K, value: number): void {
  map[key] = (map[key] ?? 0) + value;
}

export function computeMonthlyBalance(input: BalanceInput): MonthlyBalance {
  const { month, hourlyRateCents } = input;
  const members = orderMembers(input.members);
  const known = new Set(members.map((m) => m.id));
  const entries = input.entries.filter((e) => isInMonth(e.date, month) && known.has(e.memberId));

  const paid: Partial<Record<string, number>> = {};
  const minutes: Partial<Record<string, number>> = {};
  const byExpenseCategory: Partial<Record<ExpenseCategory, number>> = {};
  const byTimeCategory: Partial<Record<TimeCategory, number>> = {};

  for (const e of entries) {
    if (e.kind === "expense") {
      addTo(paid, e.memberId, e.amountCents);
      addTo(byExpenseCategory, e.category, e.amountCents);
    } else {
      addTo(minutes, e.memberId, e.minutes);
      addTo(byTimeCategory, e.category, e.minutes);
    }
  }

  const sum = (rec: Partial<Record<string, number>>): number =>
    Object.values(rec).reduce<number>((a, b) => a + (b ?? 0), 0);
  const totalOutOfPocketCents = sum(paid);
  const totalMinutes = sum(minutes);
  const shares = members.length > 0 ? splitEqually(totalOutOfPocketCents, members.length) : [];

  const memberBalances: MemberBalance[] = members.map((m, i) => {
    const paidCents = paid[m.id] ?? 0;
    const mins = minutes[m.id] ?? 0;
    const fairShareCents = shares[i];
    return {
      memberId: m.id,
      name: m.name,
      role: m.role,
      paidCents,
      minutes: mins,
      timeValueCents: timeValueCents(mins, hourlyRateCents),
      fairShareCents,
      suggestedContributionCents:
        m.role === "caregiver" ? 0 : Math.max(0, fairShareCents - paidCents),
    };
  });

  return {
    month,
    totalOutOfPocketCents,
    totalMinutes,
    totalTimeValueCents: timeValueCents(totalMinutes, hourlyRateCents),
    hourlyRateCents,
    members: memberBalances,
    byExpenseCategory,
    byTimeCategory,
  };
}
