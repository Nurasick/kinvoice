/**
 * Postgres Repository (Neon + Drizzle). Owner: Nurali.
 * IDs are generated in the app so multi-row writes can go in one `db.batch` (one round trip, atomic).
 */
import "server-only";
import { and, asc, desc, eq, gte, inArray, lt } from "drizzle-orm";
import type { WorkspaceView } from "@/shared/domain";
import { getDb, type Db } from "../db/client";
import { entries, invoices, members, paymentMarks, workspaces } from "../db/schema";
import { newId } from "../tokens";
import { entryColumns, toEntry, toInvoice, toMember, toPayment, toWorkspace } from "./postgres-mappers";
import type { Repository } from "./types";

/** [first day of month, first day of next month) as YYYY-MM-DD strings. */
export function monthRange(month: string): [string, string] {
  const [y, m] = month.split("-").map(Number);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  return [`${month}-01`, `${next}-01`];
}

async function loadView(db: Db, workspaceId: string): Promise<WorkspaceView | null> {
  const [ws, ms] = await db.batch([
    db.select().from(workspaces).where(eq(workspaces.id, workspaceId)),
    db.select().from(members).where(eq(members.workspaceId, workspaceId)).orderBy(asc(members.position)),
  ]);
  if (ws.length === 0) return null;
  return { workspace: toWorkspace(ws[0]), members: ms.map(toMember) };
}

async function mustLoadView(db: Db, workspaceId: string): Promise<WorkspaceView> {
  const view = await loadView(db, workspaceId);
  if (!view) throw new Error(`workspace ${workspaceId} not found`);
  return view;
}

async function loadInvoices(db: Db, rows: (typeof invoices.$inferSelect)[]) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const pays = await db.select().from(paymentMarks).where(inArray(paymentMarks.invoiceId, ids));
  return rows.map((r) => toInvoice(r, pays));
}

export function createPostgresRepository(databaseUrl: string): Repository {
  const db = getDb(databaseUrl);

  return {
    async createWorkspace(input) {
      const workspaceId = newId();
      const memberRows = input.members.map((m, position) => ({
        id: newId(),
        workspaceId,
        name: m.name,
        role: m.role,
        email: m.email ?? null,
        position,
      }));
      await db.batch([
        db.insert(workspaces).values({
          id: workspaceId,
          editKeyHash: input.editKeyHash,
          parentName: input.parentName,
          hourlyRateCents: input.hourlyRateCents,
          caregiverHandles: input.caregiverHandles,
          isDemo: input.isDemo,
        }),
        db.insert(members).values(memberRows),
      ]);
      return mustLoadView(db, workspaceId);
    },

    async findWorkspaceByKeyHash(editKeyHash) {
      const rows = await db
        .select({ id: workspaces.id })
        .from(workspaces)
        .where(eq(workspaces.editKeyHash, editKeyHash));
      return rows.length === 0 ? null : loadView(db, rows[0].id);
    },

    findWorkspaceById: (workspaceId) => loadView(db, workspaceId),

    async updateWorkspace(workspaceId, patch) {
      if (Object.keys(patch).length > 0) {
        await db.update(workspaces).set(patch).where(eq(workspaces.id, workspaceId));
      }
      return mustLoadView(db, workspaceId);
    },

    async deleteWorkspace(workspaceId) {
      await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
    },

    async listEntries(workspaceId, month) {
      const [from, to] = monthRange(month);
      const rows = await db
        .select()
        .from(entries)
        .where(and(eq(entries.workspaceId, workspaceId), gte(entries.date, from), lt(entries.date, to)))
        .orderBy(desc(entries.date), desc(entries.createdAt));
      return rows.map(toEntry);
    },

    async createEntries(workspaceId, newEntries) {
      const rows = await db
        .insert(entries)
        .values(newEntries.map((e) => ({ ...entryColumns(e), id: newId(), workspaceId })))
        .returning();
      return rows.map(toEntry);
    },

    async updateEntry(workspaceId, entryId, entry) {
      const rows = await db
        .update(entries)
        .set(entryColumns(entry))
        .where(and(eq(entries.id, entryId), eq(entries.workspaceId, workspaceId)))
        .returning();
      return rows.length === 0 ? null : toEntry(rows[0]);
    },

    async deleteEntry(workspaceId, entryId) {
      const rows = await db
        .delete(entries)
        .where(and(eq(entries.id, entryId), eq(entries.workspaceId, workspaceId)))
        .returning({ id: entries.id });
      return rows.length > 0;
    },

    async createInvoice(workspaceId, input) {
      const [row] = await db
        .insert(invoices)
        .values({ ...input, id: newId(), workspaceId })
        .returning();
      return toInvoice(row, []);
    },

    async listInvoices(workspaceId) {
      const rows = await db
        .select()
        .from(invoices)
        .where(eq(invoices.workspaceId, workspaceId))
        .orderBy(desc(invoices.publishedAt));
      return loadInvoices(db, rows);
    },

    async findInvoice(workspaceId, invoiceId) {
      const rows = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.id, invoiceId), eq(invoices.workspaceId, workspaceId)));
      const [invoice] = await loadInvoices(db, rows);
      return invoice ?? null;
    },

    async findInvoiceByToken(publicToken) {
      const rows = await db.select().from(invoices).where(eq(invoices.publicToken, publicToken));
      if (rows.length === 0) return null;
      const [invoice] = await loadInvoices(db, rows);
      return { invoice, workspaceId: rows[0].workspaceId };
    },

    async upsertPayment(invoiceId, input) {
      const values = { ...input, updatedAt: new Date() };
      const [row] = await db
        .insert(paymentMarks)
        .values({ ...values, id: newId(), invoiceId })
        .onConflictDoUpdate({ target: [paymentMarks.invoiceId, paymentMarks.memberId], set: values })
        .returning();
      return toPayment(row);
    },
  };
}
