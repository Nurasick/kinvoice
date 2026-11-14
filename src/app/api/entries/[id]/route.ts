import { UpdateEntryRequest } from "@/shared/api";
import { handle, HttpError, ok, parseJson, requireUuid, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";
import { assertMembers } from "@/server/services";

/** PATCH /api/entries/:id → Entry */
export const PATCH = handle(async (req: Request, ctx: RouteContext<"/api/entries/[id]">) => {
  const view = await requireWorkspace(req);
  const id = requireUuid((await ctx.params).id, "Entry");
  const entry = await parseJson(req, UpdateEntryRequest);
  assertMembers(view, [entry]);
  const updated = await getRepository().updateEntry(view.workspace.id, id, entry);
  if (!updated) throw new HttpError("not_found", "Entry not found");
  return ok(updated);
});

/** DELETE /api/entries/:id → { deleted: true } */
export const DELETE = handle(async (req: Request, ctx: RouteContext<"/api/entries/[id]">) => {
  const view = await requireWorkspace(req);
  const id = requireUuid((await ctx.params).id, "Entry");
  const deleted = await getRepository().deleteEntry(view.workspace.id, id);
  if (!deleted) throw new HttpError("not_found", "Entry not found");
  return ok({ deleted: true as const });
});
