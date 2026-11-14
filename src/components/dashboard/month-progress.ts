/**
 * Where the caregiver is in the monthly loop: log → send → settle. Pure, so it is tested.
 * Owner: Nurali.
 */
import type { Invoice } from "@/shared/domain";
import { settledCount, siblingRows, type SiblingRow } from "@/components/invoice/invoice-view";

export type StepState = "done" | "current" | "upcoming";

export interface MonthProgress {
  logged: { state: StepState; entries: number };
  sent: { state: StepState; invoice: Invoice | null };
  settled: { state: StepState; rows: SiblingRow[]; settled: number; total: number };
  /** The one thing to do next. */
  next: "log" | "send" | "follow-up" | "done";
}

/** Latest invoice published for the month, if any. */
export function latestInvoice(invoices: readonly Invoice[], month: string): Invoice | null {
  return (
    invoices.filter((i) => i.month === month).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0] ??
    null
  );
}

export function monthProgress(entries: number, invoices: readonly Invoice[], month: string): MonthProgress {
  const invoice = latestInvoice(invoices, month);
  const rows = invoice ? siblingRows(invoice) : [];
  const settled = settledCount(rows);
  const allSettled = invoice !== null && settled === rows.length;

  const logged: StepState = entries > 0 ? "done" : "current";
  const sent: StepState = invoice ? "done" : entries > 0 ? "current" : "upcoming";
  const settle: StepState = allSettled ? "done" : invoice ? "current" : "upcoming";
  const next = entries === 0 ? "log" : !invoice ? "send" : allSettled ? "done" : "follow-up";

  return {
    logged: { state: logged, entries },
    sent: { state: sent, invoice },
    settled: { state: settle, rows, settled, total: rows.length },
    next,
  };
}
