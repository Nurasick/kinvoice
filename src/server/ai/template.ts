/**
 * Deterministic invoice message — the fallback when AI is unavailable. Owner: Olzhas.
 * Uses only numbers from the computed balance.
 */
import { formatCents, formatMinutes } from "@/lib/money";
import type { InvoiceMessageInput } from "./types";

function monthName(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

export function templateInvoiceMessage({ tone, parentName, caregiverName, balance }: InvoiceMessageInput): string {
  const month = monthName(balance.month);
  const total = formatCents(balance.totalOutOfPocketCents);
  const hours = formatMinutes(balance.totalMinutes);
  const share = formatCents(balance.members.find((m) => m.role === "sibling")?.fairShareCents ?? 0);

  if (tone === "brief") {
    return `${month} care for ${parentName}: ${total} out of pocket, ${hours} of care time. Suggested share is about ${share} each. Details below. — ${caregiverName}`;
  }
  if (tone === "direct") {
    return `Here is ${parentName}'s care summary for ${month}. Out-of-pocket costs were ${total}, and ${hours} of care time went in. Split equally, the suggested contribution is about ${share} per person. Please use the buttons below to send yours. Thanks, ${caregiverName}`;
  }
  return `Hi both, here's how ${month} went with ${parentName}. Between appointments, groceries and everything in between, care cost ${total} this month, and we spent ${hours} together. If you can, a suggested contribution of about ${share} each would really help. Thank you for being part of this. Love, ${caregiverName}`;
}
