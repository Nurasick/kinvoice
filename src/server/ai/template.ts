/**
 * Deterministic invoice message — the fallback when AI is unavailable. Owner: Olzhas.
 * Uses only numbers from the computed balance.
 */
import type { MonthlyBalance } from "@/shared/domain";
import { formatCents, formatMinutes } from "@/lib/money";
import type { InvoiceMessageInput } from "./types";

/** "2026-11" → "November" */
export function monthName(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

/** "Mike: $120.00, Emily: $338.40" — only siblings with something to contribute. */
function contributions(balance: MonthlyBalance): string {
  return balance.members
    .filter((m) => m.role === "sibling" && m.suggestedContributionCents > 0)
    .map((m) => `${m.name}: ${formatCents(m.suggestedContributionCents)}`)
    .join(", ");
}

function greeting(balance: MonthlyBalance): string {
  const siblings = balance.members.filter((m) => m.role === "sibling").map((m) => m.name);
  if (siblings.length === 1) return `Hi ${siblings[0]}`;
  if (siblings.length === 2) return `Hi ${siblings[0]} and ${siblings[1]}`;
  return "Hi everyone";
}

/** "$1,015.19 out of pocket and 17h 45m of care time" — zero parts left out, never "$0.00". */
function totals(balance: MonthlyBalance): string | null {
  const parts = [
    balance.totalOutOfPocketCents > 0 ? `${formatCents(balance.totalOutOfPocketCents)} out of pocket` : null,
    balance.totalMinutes > 0 ? `${formatMinutes(balance.totalMinutes)} of care time` : null,
  ].filter((p): p is string => p !== null);
  return parts.length > 0 ? parts.join(" and ") : null;
}

export function templateInvoiceMessage({ tone, parentName, caregiverName, balance }: InvoiceMessageInput): string {
  const month = monthName(balance.month);
  const sum = totals(balance);
  const asks = contributions(balance);
  const askLine = asks ? `Suggested contribution — ${asks}.` : "No contributions are suggested this month.";

  if (tone === "brief") {
    return `${month} care for ${parentName}${sum ? `: ${sum}` : ""}. ${askLine} Details below. — ${caregiverName}`;
  }
  if (tone === "direct") {
    const summary = sum ? ` This month: ${sum}. Costs are split equally.` : "";
    return `Here is ${parentName}'s care summary for ${month}.${summary} ${askLine} You can use the buttons below. Thanks, ${caregiverName}`;
  }
  const story = sum ? ` Between appointments, groceries and everything in between, this month came to ${sum}.` : "";
  return `${greeting(balance)}, here's how ${month} went with ${parentName}.${story} ${askLine} Thank you for being part of this. Love, ${caregiverName}`;
}
