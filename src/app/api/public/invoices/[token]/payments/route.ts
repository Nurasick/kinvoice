import { MarkSentRequest } from "@/shared/api";
import { handle, HttpError, ok, parseJson } from "@/server/http";
import { getRepository } from "@/server/repo";

/** POST /api/public/invoices/:token/payments — sibling says "I've sent it". */
export const POST = handle(
  async (req: Request, ctx: RouteContext<"/api/public/invoices/[token]/payments">) => {
    const { token } = await ctx.params;
    const body = await parseJson(req, MarkSentRequest);
    const repo = getRepository();
    const found = await repo.findInvoiceByToken(token);
    if (!found) throw new HttpError("not_found", "This invoice link is not valid");
    const isSibling = found.invoice.snapshot.members.some(
      (m) => m.memberId === body.memberId && m.role === "sibling",
    );
    if (!isSibling) throw new HttpError("bad_request", "Unknown memberId");
    const existing = found.invoice.payments.find((p) => p.memberId === body.memberId);
    // Never downgrade a caregiver-confirmed payment back to "sent".
    if (existing?.status === "received") return ok(existing);
    return ok(await repo.upsertPayment(found.invoice.id, { ...body, status: "sent" }));
  },
);
