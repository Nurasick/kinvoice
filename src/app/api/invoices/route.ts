import { PublishInvoiceRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";
import { getMonthlyBalance } from "@/server/services";
import { newSecretToken } from "@/server/tokens";

/** GET /api/invoices → Invoice[] */
export const GET = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  return ok(await getRepository().listInvoices(view.workspace.id));
});

/** POST /api/invoices — publish; balance is computed and frozen server-side. */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const body = await parseJson(req, PublishInvoiceRequest);
  const snapshot = await getMonthlyBalance(view, body.month);
  const invoice = await getRepository().createInvoice(view.workspace.id, {
    ...body,
    snapshot,
    publicToken: newSecretToken(),
  });
  return ok(invoice, 201);
});
