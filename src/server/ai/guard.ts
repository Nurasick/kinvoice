/**
 * Checks an AI-written invoice message before it reaches the caregiver. Owner: Olzhas.
 * The AI never decides money: every dollar amount in the text must be one of the
 * numbers lib/money computed. Anything else → template fallback.
 */
import type { MonthlyBalance } from "@/shared/domain";
import { parseDollarsToCents } from "@/lib/money";

const FORBIDDEN = /\b(owe|owes|owed|owing|debt|debts)\b/i;
const DOLLARS = /\$\s?\d[\d,]*(?:\.\d+)?/g;
const MAX_LENGTH = 1500;

/** Every cents value the message may legitimately mention. */
export function allowedCents(balance: MonthlyBalance): Set<number> {
  const values = [
    balance.totalOutOfPocketCents,
    balance.totalTimeValueCents,
    balance.hourlyRateCents,
    ...Object.values(balance.byExpenseCategory),
    ...balance.members.flatMap((m) => [m.paidCents, m.timeValueCents, m.fairShareCents, m.suggestedContributionCents]),
  ];
  return new Set(values.filter((v): v is number => typeof v === "number"));
}

export function isSafeInvoiceMessage(message: string, balance: MonthlyBalance): boolean {
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > MAX_LENGTH || FORBIDDEN.test(trimmed)) return false;
  const allowed = allowedCents(balance);
  for (const match of trimmed.matchAll(DOLLARS)) {
    const cents = parseDollarsToCents(match[0]);
    if (cents === null || !allowed.has(cents)) return false;
  }
  return true;
}
