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

export function templateInvoiceMessage({ tone, parentName, caregiverName, balance }: InvoiceMessageInput): string {
  const month = monthName(balance.month);
  const total = formatCents(balance.totalOutOfPocketCents);
  const hours = formatMinutes(balance.totalMinutes);
  const asks = contributions(balance);
  const askLine = asks ? `Suggested contribution — ${asks}.` : "No contributions are suggested this month.";

  if (tone === "brief") {
    return `${month} care for ${parentName}: ${total} out of pocket, ${hours} of care time. ${askLine} Details below. — ${caregiverName}`;
  }
  if (tone === "direct") {
    return `Here is ${parentName}'s care summary for ${month}. Out-of-pocket costs were ${total}, and ${hours} of care time went in. Costs are split equally. ${askLine} You can use the buttons below. Thanks, ${caregiverName}`;
  }
  return `${greeting(balance)}, here's how ${month} went with ${parentName}. Between appointments, groceries and everything in between, care cost ${total} this month, and we spent ${hours} together. ${askLine} Thank you for being part of this. Love, ${caregiverName}`;
}
