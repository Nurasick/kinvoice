import { CreateEntriesRequest, ListEntriesQuery } from "@/shared/api";
import { handle, ok, parseJson, parseQuery, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";
import { assertMembers } from "@/server/services";

/** GET /api/entries?month=YYYY-MM → Entry[] */
export const GET = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { month } = parseQuery(req, ListEntriesQuery);
  return ok(await getRepository().listEntries(view.workspace.id, month));
});

/** POST /api/entries { entries } → Entry[] */
export const POST = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { entries } = await parseJson(req, CreateEntriesRequest);
  assertMembers(view, entries);
  return ok(await getRepository().createEntries(view.workspace.id, entries), 201);
});
