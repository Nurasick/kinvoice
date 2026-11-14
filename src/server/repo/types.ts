/**
 * SHARED CONTRACT — frozen. Owner: Nurali.
 *
 * Storage interface. Two implementations:
 *   memory.ts   — default when DATABASE_URL is empty (local dev, tests)
 *   postgres.ts — Neon via Drizzle (production)
 * Route handlers only ever talk to `getRepository()` from ./index.
 * Every method that takes `workspaceId` must scope its query to it.
 */
import type {
  Entry,
  Invoice,
  InvoiceTone,
  Member,
  MonthlyBalance,
  NewEntry,
  PaymentHandles,
  PaymentMark,
  PaymentMethod,
  PaymentStatus,
  WorkspaceView,
} from "@/shared/domain";

export interface CreateWorkspaceInput {
  editKeyHash: string;
  parentName: string;
  hourlyRateCents: number;
  caregiverHandles: PaymentHandles;
  isDemo: boolean;
  /** Caregiver first. */
  members: ReadonlyArray<Omit<Member, "id">>;
}

export interface UpdateWorkspaceInput {
  parentName?: string;
  hourlyRateCents?: number;
  caregiverHandles?: PaymentHandles;
}

export interface CreateInvoiceInput {
  month: string;
  tone: InvoiceTone;
  message: string;
  snapshot: MonthlyBalance;
  publicToken: string;
}

export interface UpsertPaymentInput {
  memberId: string;
  amountCents: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface Repository {
  createWorkspace(input: CreateWorkspaceInput): Promise<WorkspaceView>;
  findWorkspaceByKeyHash(editKeyHash: string): Promise<WorkspaceView | null>;
  findWorkspaceById(workspaceId: string): Promise<WorkspaceView | null>;
  updateWorkspace(workspaceId: string, patch: UpdateWorkspaceInput): Promise<WorkspaceView>;
  /** Deletes the workspace and everything in it (members, entries, invoices, payments). */
  deleteWorkspace(workspaceId: string): Promise<void>;

  /** Entries whose date is in `month` (YYYY-MM), newest date first. */
  listEntries(workspaceId: string, month: string): Promise<Entry[]>;
  createEntries(workspaceId: string, entries: readonly NewEntry[]): Promise<Entry[]>;
  /** null when the entry doesn't exist in this workspace. */
  updateEntry(workspaceId: string, entryId: string, entry: NewEntry): Promise<Entry | null>;
  /** false when the entry doesn't exist in this workspace. */
  deleteEntry(workspaceId: string, entryId: string): Promise<boolean>;

  createInvoice(workspaceId: string, input: CreateInvoiceInput): Promise<Invoice>;
  /** Newest first, payments included. */
  listInvoices(workspaceId: string): Promise<Invoice[]>;
  findInvoice(workspaceId: string, invoiceId: string): Promise<Invoice | null>;
  findInvoiceByToken(publicToken: string): Promise<{ invoice: Invoice; workspaceId: string } | null>;

  /** One mark per (invoice, member); a later call overwrites it ("sent" → "received"). */
  upsertPayment(invoiceId: string, input: UpsertPaymentInput): Promise<PaymentMark>;
}
