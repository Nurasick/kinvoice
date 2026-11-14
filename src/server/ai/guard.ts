/**
 * Checks an AI-written invoice message before it reaches the caregiver. Owner: Olzhas.
 * The AI never decides money: every dollar amount in the text must be one of the
 * numbers lib/money computed. Anything else → template fallback.
 */
import type { MonthlyBalance } from "@/shared/domain";
import { parseDollarsToCents } from "@/lib/money";

const FORBIDDEN = /\b(owe|owes|owed|owing|debt|debts)\b/i;
/** Russian and Kazakh "debt / owes" words; \b doesn't work on Cyrillic, so letter lookarounds. */
const FORBIDDEN_RU_KK =
  /(?<!\p{L})(долг|долга|долги|долгов|долгу|должен|должна|должны|задолженност\p{L}*|задолжал\p{L}*|қарыз\p{L}*|борыш\p{L}*)(?!\p{L})/iu;
/** An amount written without "$" first ("300 долларов", "218.40 USD") escapes the $ check, so it's refused. */
const WORDED_AMOUNT = /\d[\d\s.,]*\s?(?:доллар|долл\.|dollars?\b|usd\b|руб|тенге|теңге|₸)/iu;
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

/** Cents value → how many times it may appear as a suggested contribution (two siblings can share an amount). */
function requiredContributions(balance: MonthlyBalance): Map<number, number> {
  const counts = new Map<number, number>();
  for (const m of balance.members) {
    if (m.role !== "sibling" || m.suggestedContributionCents <= 0) continue;
    counts.set(m.suggestedContributionCents, (counts.get(m.suggestedContributionCents) ?? 0) + 1);
  }
  return counts;
}

/**
 * True when the message only quotes real, non-zero amounts and names every
 * suggested contribution exactly once (no "$0.00 contributed", no repeats).
 */
export function isSafeInvoiceMessage(message: string, balance: MonthlyBalance): boolean {
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > MAX_LENGTH) return false;
  if (FORBIDDEN.test(trimmed) || FORBIDDEN_RU_KK.test(trimmed) || WORDED_AMOUNT.test(trimmed)) return false;
  const allowed = allowedCents(balance);
  const seen = new Map<number, number>();
  for (const match of trimmed.matchAll(DOLLARS)) {
    const cents = parseDollarsToCents(match[0]);
    if (cents === null || cents === 0 || !allowed.has(cents)) return false;
    seen.set(cents, (seen.get(cents) ?? 0) + 1);
  }
  for (const [cents, times] of requiredContributions(balance)) {
    if (seen.get(cents) !== times) return false;
  }
  return true;
}
