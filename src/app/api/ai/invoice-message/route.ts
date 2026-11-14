import { InvoiceMessageRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getAiService } from "@/server/ai";
import { caregiverName, getMonthlyBalance } from "@/server/services";

/** POST /api/ai/invoice-message — AI words over deterministic numbers. Owner: Olzhas. */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { month, tone } = await parseJson(req, InvoiceMessageRequest);
  const balance = await getMonthlyBalance(view, month);
  return ok(
    await getAiService().draftInvoiceMessage({
      tone,
      parentName: view.workspace.parentName,
      caregiverName: caregiverName(view),
      balance,
    }),
  );
});
