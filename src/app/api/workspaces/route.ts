import { CreateWorkspaceRequest } from "@/shared/api";
import { handle, ok, parseJson } from "@/server/http";
import { createWorkspace } from "@/server/services";

/** POST /api/workspaces — family setup (no auth). */
export const POST = handle(async (req: Request) => {
  const body = await parseJson(req, CreateWorkspaceRequest);
  return ok(await createWorkspace(body), 201);
});
