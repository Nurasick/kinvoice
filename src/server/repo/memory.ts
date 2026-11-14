/**
 * In-memory Repository. Owner: Nurali.
 * Used when DATABASE_URL is empty: local dev before Postgres exists, and tests.
 * State lives on globalThis so it survives Next dev hot reloads (not server restarts).
 */
import type { Entry, Invoice, Member, PaymentMark, Workspace, WorkspaceView } from "@/shared/domain";
import { isInMonth } from "@/lib/money";
import { newId } from "../tokens";
import type { Repository } from "./types";

interface StoredWorkspace {
  workspace: Workspace;
  editKeyHash: string;
  members: Member[];
  entries: Entry[];
  invoices: Invoice[];
}

interface MemoryState {
  workspaces: Map<string, StoredWorkspace>;
}

const globalStore = globalThis as typeof globalThis & { __kinvoiceMemory?: MemoryState };

function state(): MemoryState {
  globalStore.__kinvoiceMemory ??= { workspaces: new Map() };
  return globalStore.__kinvoiceMemory;
}

const nowIso = (): string => new Date().toISOString();
const view = (s: StoredWorkspace): WorkspaceView => ({ workspace: s.workspace, members: s.members });

function mustGet(workspaceId: string): StoredWorkspace {
  const s = state().workspaces.get(workspaceId);
  if (!s) throw new Error(`workspace ${workspaceId} not found`);
  return s;
}

function findInvoiceAnywhere(invoiceId: string): { store: StoredWorkspace; invoice: Invoice } | null {
  for (const store of state().workspaces.values()) {
    const invoice = store.invoices.find((i) => i.id === invoiceId);
    if (invoice) return { store, invoice };
  }
  return null;
}

export const memoryRepository: Repository = {
  async createWorkspace(input) {
    const workspace: Workspace = {
      id: newId(),
      parentName: input.parentName,
      hourlyRateCents: input.hourlyRateCents,
      currency: "USD",
      caregiverHandles: input.caregiverHandles,
      isDemo: input.isDemo,
      createdAt: nowIso(),
    };
    const members = input.members.map((m) => ({ ...m, id: newId() }));
    const stored: StoredWorkspace = { workspace, editKeyHash: input.editKeyHash, members, entries: [], invoices: [] };
    state().workspaces.set(workspace.id, stored);
    return view(stored);
  },

  async findWorkspaceByKeyHash(editKeyHash) {
    for (const s of state().workspaces.values()) if (s.editKeyHash === editKeyHash) return view(s);
    return null;
  },

  async findWorkspaceById(workspaceId) {
    const s = state().workspaces.get(workspaceId);
    return s ? view(s) : null;
  },

  async updateWorkspace(workspaceId, patch) {
    const s = mustGet(workspaceId);
    s.workspace = { ...s.workspace, ...patch };
    return view(s);
  },

  async deleteWorkspace(workspaceId) {
    state().workspaces.delete(workspaceId);
  },

  async listEntries(workspaceId, month) {
    return mustGet(workspaceId)
      .entries.filter((e) => isInMonth(e.date, month))
      .toSorted((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  },

  async createEntries(workspaceId, entries) {
    const s = mustGet(workspaceId);
    const created = entries.map((e): Entry => ({ ...e, id: newId(), createdAt: nowIso() }));
    s.entries = [...s.entries, ...created];
    return created;
  },

  async updateEntry(workspaceId, entryId, entry) {
    const s = mustGet(workspaceId);
    const existing = s.entries.find((e) => e.id === entryId);
    if (!existing) return null;
    const updated: Entry = { ...entry, id: entryId, createdAt: existing.createdAt };
    s.entries = s.entries.map((e) => (e.id === entryId ? updated : e));
    return updated;
  },

  async deleteEntry(workspaceId, entryId) {
    const s = mustGet(workspaceId);
    const before = s.entries.length;
    s.entries = s.entries.filter((e) => e.id !== entryId);
    return s.entries.length < before;
  },

  async createInvoice(workspaceId, input) {
    const s = mustGet(workspaceId);
    const invoice: Invoice = { ...input, id: newId(), publishedAt: nowIso(), payments: [] };
    s.invoices = [invoice, ...s.invoices];
    return invoice;
  },

  async listInvoices(workspaceId) {
    return mustGet(workspaceId).invoices;
  },

  async findInvoice(workspaceId, invoiceId) {
    return mustGet(workspaceId).invoices.find((i) => i.id === invoiceId) ?? null;
  },

  async findInvoiceByToken(publicToken) {
    for (const s of state().workspaces.values()) {
      const invoice = s.invoices.find((i) => i.publicToken === publicToken);
      if (invoice) return { invoice, workspaceId: s.workspace.id };
    }
    return null;
  },

  async upsertPayment(invoiceId, input) {
    const found = findInvoiceAnywhere(invoiceId);
    if (!found) throw new Error(`invoice ${invoiceId} not found`);
    const { store, invoice } = found;
    const previous = invoice.payments.find((p) => p.memberId === input.memberId);
    const mark: PaymentMark = { ...input, id: previous?.id ?? newId(), invoiceId, updatedAt: nowIso() };
    const payments = [...invoice.payments.filter((p) => p.memberId !== input.memberId), mark];
    store.invoices = store.invoices.map((i) => (i.id === invoiceId ? { ...i, payments } : i));
    return mark;
  },
};
