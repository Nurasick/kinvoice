import { QuickLogRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getAiService } from "@/server/ai";
import { requestLocale } from "@/server/ai/locale";

/**
 * POST /api/ai/quick-log — sentence → draft entries. Saves nothing. Owner: Olzhas.
 * Notes follow the text's language; `locale` (the UI language) only breaks ties.
 */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { text, today, locale } = await parseJson(req, QuickLogRequest);
  const input = { text, today, members: view.members, locale: requestLocale(req, locale) };
  return ok(await getAiService().parseQuickLog(input));
});
