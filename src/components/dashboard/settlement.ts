/**
 * Where the month's money stands once an invoice is out. Pure; amounts come from the invoice's
 * frozen snapshot (what siblings were actually sent), statuses from its payment marks.
 */
import type { Invoice, MonthlyBalance } from "@/shared/domain";
import { siblingRows, type SiblingRow, type SiblingStatus } from "@/components/invoice/invoice-view";

export interface Settlement {
  /** Siblings' rows from the latest invoice for the month. */
  rows: SiblingRow[];
  stillToComeCents: number;
  receivedCents: number;
  isAllSettled: boolean;
  /** Costs logged since the invoice went out: the sent link no longer matches the month. */
  hasNewCosts: boolean;
}

const OPEN: readonly SiblingStatus[] = ["waiting", "sent"];

export function settlement(invoice: Invoice | null, live: MonthlyBalance): Settlement | null {
  if (!invoice) return null;
  const rows = siblingRows(invoice);
  const stillToComeCents = rows
    .filter((r) => OPEN.includes(r.status))
    .reduce((sum, r) => sum + r.member.suggestedContributionCents, 0);
  const receivedCents = rows
    .filter((r) => r.status === "received")
    .reduce((sum, r) => sum + r.amountCents, 0);
  return {
    rows,
    stillToComeCents,
    receivedCents,
    isAllSettled: rows.every((r) => !OPEN.includes(r.status)),
    hasNewCosts: live.totalOutOfPocketCents !== invoice.snapshot.totalOutOfPocketCents,
  };
}

export function rowFor(s: Settlement | null, memberId: string): SiblingRow | undefined {
  return s?.rows.find((r) => r.member.memberId === memberId);
}
