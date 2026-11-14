import { PublishInvoiceRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";
import { publishInvoice } from "@/server/services";

/** GET /api/invoices → Invoice[] */
export const GET = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  return ok(await getRepository().listInvoices(view.workspace.id));
});

/** POST /api/invoices — publish; balance is computed and frozen server-side, earlier payment marks carry over. */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const body = await parseJson(req, PublishInvoiceRequest);
  return ok(await publishInvoice(view, body), 201);
});
