/**
 * SHARED CONTRACT — frozen. Owner: Nurali.
 * Typed browser client for every endpoint in @/shared/api. Use this from client components;
 * never call fetch("/api/...") by hand.
 */
import {
  WORKSPACE_KEY_HEADER,
  type ApiErrorBody,
  type CreateEntriesRequest,
  type CreateWorkspaceRequest,
  type CreateWorkspaceResponse,
  type ErrorCode,
  type InvoiceMessageRequest,
  type InvoiceMessageResponse,
  type MarkReceivedRequest,
  type MarkSentRequest,
  type PublishInvoiceRequest,
  type QuickLogRequest,
  type QuickLogResponse,
  type ReceiptResponse,
  type UpdateWorkspaceRequest,
} from "@/shared/api";
import type {
  Entry,
  Invoice,
  MonthlyBalance,
  NewEntry,
  PaymentMark,
  PublicInvoice,
  WorkspaceView,
} from "@/shared/domain";

export class ApiError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  key?: string;
  json?: unknown;
  form?: FormData;
}

async function request<T>(path: string, { method = "GET", key, json, form }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (key) headers[WORKSPACE_KEY_HEADER] = key;
  if (json !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(path, {
    method,
    headers,
    body: form ?? (json === undefined ? undefined : JSON.stringify(json)),
    cache: "no-store",
  });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (body as ApiErrorBody | null)?.error;
    throw new ApiError(err?.code ?? "internal", err?.message ?? `Request failed (${res.status})`, res.status, err?.details);
  }
  return (body as { data: T }).data;
}

/** Caregiver API, authorised by the workspace edit key. */
export function workspaceApi(key: string) {
  return {
    getWorkspace: () => request<WorkspaceView>("/api/workspace", { key }),
    updateWorkspace: (patch: UpdateWorkspaceRequest) =>
      request<WorkspaceView>("/api/workspace", { method: "PATCH", key, json: patch }),
    deleteWorkspace: () => request<{ deleted: true }>("/api/workspace", { method: "DELETE", key }),

    listEntries: (month: string) => request<Entry[]>(`/api/entries?month=${encodeURIComponent(month)}`, { key }),
    createEntries: (entries: CreateEntriesRequest["entries"]) =>
      request<Entry[]>("/api/entries", { method: "POST", key, json: { entries } }),
    updateEntry: (id: string, entry: NewEntry) =>
      request<Entry>(`/api/entries/${encodeURIComponent(id)}`, { method: "PATCH", key, json: entry }),
    deleteEntry: (id: string) =>
      request<{ deleted: true }>(`/api/entries/${encodeURIComponent(id)}`, { method: "DELETE", key }),

    getBalance: (month: string) => request<MonthlyBalance>(`/api/balance?month=${encodeURIComponent(month)}`, { key }),

    quickLog: (body: QuickLogRequest) => request<QuickLogResponse>("/api/ai/quick-log", { method: "POST", key, json: body }),
    readReceipt: (file: File, today: string) => {
      const form = new FormData();
      form.set("file", file);
      form.set("today", today);
      return request<ReceiptResponse>("/api/ai/receipt", { method: "POST", key, form });
    },
    draftInvoiceMessage: (body: InvoiceMessageRequest) =>
      request<InvoiceMessageResponse>("/api/ai/invoice-message", { method: "POST", key, json: body }),

    listInvoices: () => request<Invoice[]>("/api/invoices", { key }),
    publishInvoice: (body: PublishInvoiceRequest) =>
      request<Invoice>("/api/invoices", { method: "POST", key, json: body }),
    markReceived: (invoiceId: string, body: MarkReceivedRequest) =>
      request<PaymentMark>(`/api/invoices/${encodeURIComponent(invoiceId)}/payments`, { method: "POST", key, json: body }),
  };
}

export type WorkspaceApi = ReturnType<typeof workspaceApi>;

/** No-auth endpoints. */
export const publicApi = {
  createWorkspace: (body: CreateWorkspaceRequest) =>
    request<CreateWorkspaceResponse>("/api/workspaces", { method: "POST", json: body }),
  createDemo: () => request<CreateWorkspaceResponse>("/api/demo", { method: "POST" }),
  getInvoice: (token: string) => request<PublicInvoice>(`/api/public/invoices/${encodeURIComponent(token)}`),
  markSent: (token: string, body: MarkSentRequest) =>
    request<PaymentMark>(`/api/public/invoices/${encodeURIComponent(token)}/payments`, { method: "POST", json: body }),
};
