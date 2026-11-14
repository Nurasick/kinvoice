import { InvoiceMessageRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getAiService } from "@/server/ai";
import { requestLocale } from "@/server/ai/locale";
import { caregiverName, getMonthlyBalance } from "@/server/services";

/**
 * POST /api/ai/invoice-message — AI words over deterministic numbers. Owner: Olzhas.
 * Language: the body `locale` (the UI the caregiver is using), then the `lang` cookie, then Accept-Language.
 */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { month, tone, locale } = await parseJson(req, InvoiceMessageRequest);
  const balance = await getMonthlyBalance(view, month);
  const input = {
    tone,
    parentName: view.workspace.parentName,
    caregiverName: caregiverName(view),
    balance,
    locale: requestLocale(req, locale),
  };
  return ok(await getAiService().draftInvoiceMessage(input));
});
