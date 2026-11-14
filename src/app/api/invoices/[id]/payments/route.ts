import { MarkReceivedRequest } from "@/shared/api";
import { handle, HttpError, ok, parseJson, requireUuid, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";

/** POST /api/invoices/:id/payments — caregiver marks a sibling's payment as received. */
export const POST = handle(async (req: Request, ctx: RouteContext<"/api/invoices/[id]/payments">) => {
  const view = await requireWorkspace(req);
  const id = requireUuid((await ctx.params).id, "Invoice");
  const body = await parseJson(req, MarkReceivedRequest);
  const repo = getRepository();
  const invoice = await repo.findInvoice(view.workspace.id, id);
  if (!invoice) throw new HttpError("not_found", "Invoice not found");
  // Only siblings on this invoice can have a payment; the caregiver never pays herself.
  const isSibling = invoice.snapshot.members.some((m) => m.memberId === body.memberId && m.role === "sibling");
  if (!isSibling) throw new HttpError("bad_request", "Unknown memberId");
  return ok(await repo.upsertPayment(invoice.id, { ...body, status: "received" }));
});
