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
    const member = found.invoice.snapshot.members.find(
      (m) => m.memberId === body.memberId && m.role === "sibling",
    );
    if (!member) throw new HttpError("bad_request", "Unknown memberId");
    const existing = found.invoice.payments.find((p) => p.memberId === body.memberId);
    // Never downgrade a caregiver-confirmed payment back to "sent".
    if (existing?.status === "received") return ok(existing);
    // The amount comes from the frozen snapshot, never from the (unauthenticated) request body.
    const amountCents = member.suggestedContributionCents;
    if (amountCents === 0) throw new HttpError("bad_request", "Nothing to send for this month");
    return ok(await repo.upsertPayment(found.invoice.id, { ...body, amountCents, status: "sent" }));
  },
);
