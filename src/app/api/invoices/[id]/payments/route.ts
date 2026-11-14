import { MarkReceivedRequest } from "@/shared/api";
import { handle, HttpError, ok, parseJson, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";

/** POST /api/invoices/:id/payments — caregiver marks a payment as received. */
export const POST = handle(async (req: Request, ctx: RouteContext<"/api/invoices/[id]/payments">) => {
  const view = await requireWorkspace(req);
  const { id } = await ctx.params;
  const body = await parseJson(req, MarkReceivedRequest);
  const repo = getRepository();
  const invoice = await repo.findInvoice(view.workspace.id, id);
  if (!invoice) throw new HttpError("not_found", "Invoice not found");
  if (!view.members.some((m) => m.id === body.memberId)) {
    throw new HttpError("bad_request", "Unknown memberId");
  }
  return ok(await repo.upsertPayment(invoice.id, { ...body, status: "received" }));
});
