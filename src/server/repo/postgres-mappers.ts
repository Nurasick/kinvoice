/**
 * Row → domain mappers for the Postgres repository. Owner: Nurali.
 * Rows are validated through the shared Zod schemas, so a bad row fails loudly instead of leaking.
 */
import { Entry, Member, PaymentMark, Workspace, type Invoice, type NewEntry } from "@/shared/domain";
import type { entries, invoices, members, paymentMarks, workspaces } from "../db/schema";

type WorkspaceRow = typeof workspaces.$inferSelect;
type MemberRow = typeof members.$inferSelect;
type EntryRow = typeof entries.$inferSelect;
type InvoiceRow = typeof invoices.$inferSelect;
type PaymentRow = typeof paymentMarks.$inferSelect;

export function toWorkspace(row: WorkspaceRow): Workspace {
  return Workspace.parse({
    id: row.id,
    parentName: row.parentName,
    hourlyRateCents: row.hourlyRateCents,
    currency: row.currency,
    caregiverHandles: row.caregiverHandles,
    isDemo: row.isDemo,
    createdAt: row.createdAt.toISOString(),
  });
}

export function toMember(row: MemberRow): Member {
  return Member.parse({ id: row.id, name: row.name, role: row.role, email: row.email ?? undefined });
}

export function toEntry(row: EntryRow): Entry {
  const base = {
    id: row.id,
    date: row.date,
    memberId: row.memberId,
    note: row.note,
    source: row.source,
    category: row.category,
    createdAt: row.createdAt.toISOString(),
  };
  return Entry.parse(
    row.kind === "expense"
      ? { ...base, kind: "expense", amountCents: row.amountCents, merchant: row.merchant ?? undefined }
      : { ...base, kind: "time", minutes: row.minutes },
  );
}

export function toPayment(row: PaymentRow): PaymentMark {
  return PaymentMark.parse({ ...row, updatedAt: row.updatedAt.toISOString() });
}

export function toInvoice(row: InvoiceRow, payments: readonly PaymentRow[]): Invoice {
  return {
    id: row.id,
    month: row.month,
    publicToken: row.publicToken,
    tone: row.tone,
    message: row.message,
    snapshot: row.snapshot,
    publishedAt: row.publishedAt.toISOString(),
    payments: payments.filter((p) => p.invoiceId === row.id).map(toPayment),
  };
}

/** Domain entry → insertable column values (expense/time columns are mutually exclusive). */
export function entryColumns(e: NewEntry) {
  return {
    memberId: e.memberId,
    kind: e.kind,
    date: e.date,
    amountCents: e.kind === "expense" ? e.amountCents : null,
    minutes: e.kind === "time" ? e.minutes : null,
    category: e.category,
    merchant: e.kind === "expense" ? (e.merchant ?? null) : null,
    note: e.note,
    source: e.source,
  };
}
