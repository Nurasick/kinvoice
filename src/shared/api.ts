/**
 * SHARED CONTRACT — frozen. Owner: Nurali. Do not edit without the owner (see docs/ROLES.md).
 *
 * Request/response shapes for every endpoint. Human-readable version: docs/ARCHITECTURE.md §4.
 *
 * Envelope:
 *   success → HTTP 2xx, body `{ "data": T }`
 *   failure → HTTP 4xx/5xx, body `{ "error": { "code": ErrorCode, "message": string, "details"?: unknown } }`
 *
 * Auth: caregiver endpoints need header `x-workspace-key: <editKey>`.
 * Public endpoints (/api/public/**) are keyed by the invoice token in the path.
 */
import { z } from "zod";
import {
  DraftEntry,
  Entry,
  Id,
  Invoice,
  InvoiceTone,
  IsoDate,
  InputCents,
  IsoMonth,
  Member,
  MonthlyBalance,
  NewEntry,
  PaymentHandles,
  PaymentMark,
  PaymentMethod,
  PublicInvoice,
  Workspace,
  WorkspaceView,
} from "./domain";

export const WORKSPACE_KEY_HEADER = "x-workspace-key";

// ---------- envelope ----------

export const ErrorCode = z.enum([
  "bad_request", // 400: body/query failed validation
  "unauthorized", // 401: missing or unknown workspace key
  "not_found", // 404
  "payload_too_large", // 413: receipt file too big
  "rate_limited", // 429
  "internal", // 500
]);
export type ErrorCode = z.infer<typeof ErrorCode>;

export const ApiErrorBody = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof ApiErrorBody>;

export interface ApiSuccess<T> {
  data: T;
}

// ---------- workspace ----------

/** POST /api/workspaces — family setup. No auth. */
export const CreateWorkspaceRequest = z.object({
  parentName: z.string().trim().min(1).max(60),
  caregiverName: z.string().trim().min(1).max(60),
  siblings: z
    .array(Member.pick({ name: true, email: true }))
    .min(1)
    .max(8),
  hourlyRateCents: z.number().int().min(0).max(100_00),
  caregiverHandles: PaymentHandles.default({}),
});
export type CreateWorkspaceRequest = z.infer<typeof CreateWorkspaceRequest>;

/** Response of POST /api/workspaces and POST /api/demo. `editKey` is shown ONCE; client stores it. */
export const CreateWorkspaceResponse = z.object({
  editKey: z.string().min(20),
  view: WorkspaceView,
});
export type CreateWorkspaceResponse = z.infer<typeof CreateWorkspaceResponse>;

/** GET /api/workspace → WorkspaceView */
export const GetWorkspaceResponse = WorkspaceView;

/** PATCH /api/workspace */
export const UpdateWorkspaceRequest = z
  .object({
    parentName: Workspace.shape.parentName,
    hourlyRateCents: Workspace.shape.hourlyRateCents,
    caregiverHandles: PaymentHandles,
  })
  .partial();
export type UpdateWorkspaceRequest = z.infer<typeof UpdateWorkspaceRequest>;

/** DELETE /api/workspace → { deleted: true } */
export const DeleteWorkspaceResponse = z.object({ deleted: z.literal(true) });

// ---------- entries ----------

/** GET /api/entries?month=YYYY-MM → Entry[] (sorted by date desc) */
export const ListEntriesQuery = z.object({ month: IsoMonth });
export const ListEntriesResponse = z.array(Entry);

/** POST /api/entries — batch create (quick log can confirm several cards at once). */
export const CreateEntriesRequest = z.object({ entries: z.array(NewEntry).min(1).max(20) });
export type CreateEntriesRequest = z.infer<typeof CreateEntriesRequest>;
export const CreateEntriesResponse = z.array(Entry);

/** PATCH /api/entries/:id — full replacement of the editable fields. */
export const UpdateEntryRequest = NewEntry;
export const UpdateEntryResponse = Entry;

/** DELETE /api/entries/:id → { deleted: true } */
export const DeleteEntryResponse = z.object({ deleted: z.literal(true) });

// ---------- balance ----------

/** GET /api/balance?month=YYYY-MM → MonthlyBalance */
export const BalanceQuery = z.object({ month: IsoMonth });
export const BalanceResponse = MonthlyBalance;

// ---------- AI (drafts only; nothing is saved by these endpoints) ----------

/** POST /api/ai/quick-log */
export const QuickLogRequest = z.object({
  text: z.string().trim().min(3).max(500),
  /** Caregiver's local "today", used to resolve "yesterday", "on Monday", etc. */
  today: IsoDate,
});
export type QuickLogRequest = z.infer<typeof QuickLogRequest>;

/**
 * `fallback: true` means the AI failed/timed out/returned invalid JSON. `drafts` then holds
 * whatever could be salvaged (possibly empty) and the UI shows the manual form prefilled.
 */
export const QuickLogResponse = z.object({
  drafts: z.array(DraftEntry),
  fallback: z.boolean(),
});
export type QuickLogResponse = z.infer<typeof QuickLogResponse>;

/** POST /api/ai/receipt — multipart/form-data with field `file` (image/* or application/pdf, ≤ 5 MB). */
export const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;
export const RECEIPT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
] as const;
export const ReceiptResponse = z.object({
  draft: DraftEntry.nullable(),
  fallback: z.boolean(),
});
export type ReceiptResponse = z.infer<typeof ReceiptResponse>;

/** POST /api/ai/invoice-message — server loads the month's real data itself. */
export const InvoiceMessageRequest = z.object({ month: IsoMonth, tone: InvoiceTone });
export type InvoiceMessageRequest = z.infer<typeof InvoiceMessageRequest>;
export const InvoiceMessageResponse = z.object({
  message: z.string(),
  /** true → `message` is the deterministic template, not AI text. */
  fallback: z.boolean(),
});
export type InvoiceMessageResponse = z.infer<typeof InvoiceMessageResponse>;

// ---------- invoices ----------

/** POST /api/invoices — publish. Server computes + freezes the balance snapshot. */
export const PublishInvoiceRequest = z.object({
  month: IsoMonth,
  tone: InvoiceTone,
  message: z.string().trim().min(1).max(4000),
});
export type PublishInvoiceRequest = z.infer<typeof PublishInvoiceRequest>;
export const PublishInvoiceResponse = Invoice;

/** GET /api/invoices → Invoice[] (newest first) */
export const ListInvoicesResponse = z.array(Invoice);

/** POST /api/invoices/:id/payments — caregiver marks a sibling's payment as received. */
export const MarkReceivedRequest = z.object({
  memberId: Id,
  amountCents: InputCents,
  method: PaymentMethod,
});
export type MarkReceivedRequest = z.infer<typeof MarkReceivedRequest>;
export const MarkReceivedResponse = PaymentMark;

// ---------- public (sibling view, no auth) ----------

/** GET /api/public/invoices/:token → PublicInvoice */
export const GetPublicInvoiceResponse = PublicInvoice;

/** POST /api/public/invoices/:token/payments — sibling says "I've sent it". */
export const MarkSentRequest = z.object({
  memberId: Id,
  amountCents: InputCents,
  method: PaymentMethod,
});
export type MarkSentRequest = z.infer<typeof MarkSentRequest>;
export const MarkSentResponse = PaymentMark;
