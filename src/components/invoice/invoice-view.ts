/**
 * Display helpers for invoices. Pure; every amount comes from the invoice's frozen snapshot.
 */
import type { Invoice, MemberBalance, PaymentMark, PaymentMethod } from "@/shared/domain";

/** waiting: nothing yet · sent: sibling says they paid · received: caregiver confirmed · covered: nothing suggested */
export type SiblingStatus = "waiting" | "sent" | "received" | "covered";

export interface SiblingRow {
  member: MemberBalance;
  status: SiblingStatus;
  payment: PaymentMark | null;
  /** Amount to confirm when marking as received: what the sibling reported, else the suggestion. */
  amountCents: number;
  method: PaymentMethod;
}

export function siblingRows(invoice: Invoice): SiblingRow[] {
  return invoice.snapshot.members
    .filter((m) => m.role === "sibling")
    .map((member) => {
      const payment = invoice.payments.find((p) => p.memberId === member.memberId) ?? null;
      return {
        member,
        payment,
        status: statusOf(member, payment),
        amountCents: payment?.amountCents ?? member.suggestedContributionCents,
        method: payment?.method ?? "other",
      };
    });
}

function statusOf(member: MemberBalance, payment: PaymentMark | null): SiblingStatus {
  if (payment) return payment.status;
  return member.suggestedContributionCents === 0 ? "covered" : "waiting";
}

/** "2 of 3 settled": received or nothing-to-pay count as settled. */
export function settledCount(rows: readonly SiblingRow[]): number {
  return rows.filter((r) => r.status === "received" || r.status === "covered").length;
}

export function publicInvoiceUrl(origin: string, token: string): string {
  return `${origin}/i/${encodeURIComponent(token)}`;
}

/** Newest first by month, then by publish time (the API already sorts; this keeps the UI honest). */
export function sortInvoices(invoices: readonly Invoice[]): Invoice[] {
  return [...invoices].sort(
    (a, b) => b.month.localeCompare(a.month) || b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** "Nov 14, 2026" from an ISO datetime, in the viewer's locale timezone. */
export function publishedLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
