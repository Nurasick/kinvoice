/**
 * Use-case logic shared by several routes. Owner: Nurali.
 */
import "server-only";
import type { CreateWorkspaceRequest, CreateWorkspaceResponse, PublishInvoiceRequest } from "@/shared/api";
import type { Entry, Invoice, MonthlyBalance, NewEntry, PublicInvoice, WorkspaceView } from "@/shared/domain";
import { computeMonthlyBalance } from "@/lib/money";
import { HttpError } from "./http";
import { getRepository } from "./repo";
import { buildDemoEntries, DEMO_MEMBERS, DEMO_WORKSPACE } from "./seed/demo-family";
import { hashKey, newSecretToken } from "./tokens";

export async function createWorkspace(req: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> {
  const editKey = newSecretToken();
  const view = await getRepository().createWorkspace({
    editKeyHash: hashKey(editKey),
    parentName: req.parentName,
    hourlyRateCents: req.hourlyRateCents,
    caregiverHandles: req.caregiverHandles,
    isDemo: false,
    members: [{ name: req.caregiverName, role: "caregiver" }, ...req.siblings.map((s) => ({ ...s, role: "sibling" as const }))],
  });
  return { editKey, view };
}

export async function createDemoWorkspace(today = new Date()): Promise<CreateWorkspaceResponse> {
  const repo = getRepository();
  const editKey = newSecretToken();
  const view = await repo.createWorkspace({
    editKeyHash: hashKey(editKey),
    ...DEMO_WORKSPACE,
    isDemo: true,
    members: DEMO_MEMBERS.map(({ name, role, email }) => ({ name, role, email })),
  });
  const [sarah, mike, emily] = view.members;
  await repo.createEntries(view.workspace.id, buildDemoEntries(today, { sarah: sarah.id, mike: mike.id, emily: emily.id }));
  return { editKey, view };
}

export async function getMonthlyBalance(view: WorkspaceView, month: string): Promise<MonthlyBalance> {
  const entries = await getRepository().listEntries(view.workspace.id, month);
  return computeMonthlyBalance({
    month,
    members: view.members,
    entries,
    hourlyRateCents: view.workspace.hourlyRateCents,
  });
}

export function caregiverName(view: WorkspaceView): string {
  return view.members.find((m) => m.role === "caregiver")?.name ?? "";
}

export async function getPublicInvoice(token: string): Promise<PublicInvoice | null> {
  const repo = getRepository();
  const found = await repo.findInvoiceByToken(token);
  if (!found) return null;
  const view = await repo.findWorkspaceById(found.workspaceId);
  if (!view) return null;
  const { invoice } = found;
  return {
    parentName: view.workspace.parentName,
    caregiverName: caregiverName(view),
    caregiverHandles: view.workspace.caregiverHandles,
    month: invoice.month,
    message: invoice.message,
    snapshot: invoice.snapshot,
    entries: entriesAtPublish(await repo.listEntries(view.workspace.id, invoice.month), invoice.publishedAt),
    payments: invoice.payments,
    publishedAt: invoice.publishedAt,
  };
}

/**
 * The breakdown a sibling sees must match the frozen totals: only entries that existed when the
 * invoice was published. (Edits to those entries after publishing still show; the totals do not move.)
 */
export function entriesAtPublish(entries: readonly Entry[], publishedAt: string): Entry[] {
  const cutoff = Date.parse(publishedAt);
  return entries.filter((e) => Date.parse(e.createdAt) <= cutoff);
}

/**
 * Publishes a new invoice for the month with a frozen balance. Payment marks already recorded on the
 * previous invoice for the same month carry over, so re-publishing never resets "who has chipped in".
 */
export async function publishInvoice(view: WorkspaceView, req: PublishInvoiceRequest): Promise<Invoice> {
  const repo = getRepository();
  const snapshot = await getMonthlyBalance(view, req.month);
  const previous = (await repo.listInvoices(view.workspace.id)).find((i) => i.month === req.month);
  const invoice = await repo.createInvoice(view.workspace.id, { ...req, snapshot, publicToken: newSecretToken() });
  const siblings = new Set(snapshot.members.filter((m) => m.role === "sibling").map((m) => m.memberId));
  const carried = (previous?.payments ?? []).filter((p) => siblings.has(p.memberId));
  const payments = await Promise.all(
    carried.map(({ memberId, amountCents, method, status }) =>
      repo.upsertPayment(invoice.id, { memberId, amountCents, method, status }),
    ),
  );
  return { ...invoice, payments };
}

/** Reject entries attributed to someone outside this family. */
export function assertMembers(view: WorkspaceView, entries: readonly NewEntry[]): void {
  const ids = new Set(view.members.map((m) => m.id));
  const bad = entries.find((e) => !ids.has(e.memberId));
  if (bad) throw new HttpError("bad_request", `Unknown memberId ${bad.memberId}`);
}
