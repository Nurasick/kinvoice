import { UpdateWorkspaceRequest } from "@/shared/api";
import { handle, ok, parseJson, requireWorkspace } from "@/server/http";
import { getRepository } from "@/server/repo";

/** GET /api/workspace → WorkspaceView */
export const GET = handle(async (req: Request) => ok(await requireWorkspace(req)));

/** PATCH /api/workspace → WorkspaceView */
export const PATCH = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const patch = await parseJson(req, UpdateWorkspaceRequest);
  return ok(await getRepository().updateWorkspace(view.workspace.id, patch));
});

/** DELETE /api/workspace → { deleted: true } */
export const DELETE = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  await getRepository().deleteWorkspace(view.workspace.id);
  return ok({ deleted: true as const });
});
