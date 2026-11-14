import { handle, ok } from "@/server/http";
import { createDemoWorkspace } from "@/server/services";

/** POST /api/demo — fresh private copy of "Sarah's family" (no auth). */
export const POST = handle(async () => ok(await createDemoWorkspace(), 201));
