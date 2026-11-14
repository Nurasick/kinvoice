import { QuickLogRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getAiService } from "@/server/ai";

/** POST /api/ai/quick-log — sentence → draft entries. Saves nothing. Owner: Olzhas. */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { text, today } = await parseJson(req, QuickLogRequest);
  return ok(await getAiService().parseQuickLog({ text, today, members: view.members }));
});
