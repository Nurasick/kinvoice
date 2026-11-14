import { handle, HttpError, ok } from "@/server/http";
import { getPublicInvoice } from "@/server/services";

/** GET /api/public/invoices/:token → PublicInvoice (no auth; the token is the secret). */
export const GET = handle(async (_req: Request, ctx: RouteContext<"/api/public/invoices/[token]">) => {
  const { token } = await ctx.params;
  const invoice = await getPublicInvoice(token);
  if (!invoice) throw new HttpError("not_found", "This invoice link is not valid");
  return ok(invoice);
});
