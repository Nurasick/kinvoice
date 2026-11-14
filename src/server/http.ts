/**
 * Route-handler helpers: envelope, validation, auth. Owner: Nurali.
 */
import "server-only";
import { z } from "zod";
import { WORKSPACE_KEY_HEADER, type ApiErrorBody, type ErrorCode } from "@/shared/api";
import type { WorkspaceView } from "@/shared/domain";
import { getRepository } from "./repo";
import { hashKey } from "./tokens";

const STATUS: Record<ErrorCode, number> = {
  bad_request: 400,
  unauthorized: 401,
  not_found: 404,
  payload_too_large: 413,
  rate_limited: 429,
  internal: 500,
};

export class HttpError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ data }, { status });
}

function errorResponse(code: ErrorCode, message: string, details?: unknown): Response {
  const body: ApiErrorBody = { error: { code, message, ...(details === undefined ? {} : { details }) } };
  return Response.json(body, { status: STATUS[code] });
}

/** Wraps a handler: HttpError → its status, ZodError → 400, anything else → 500. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err: unknown) {
      if (err instanceof HttpError) return errorResponse(err.code, err.message, err.details);
      if (err instanceof z.ZodError) return errorResponse("bad_request", "Invalid input", z.treeifyError(err));
      console.error("[api] unhandled error", err);
      return errorResponse("internal", "Something went wrong. Please try again.");
    }
  };
}

export async function parseJson<S extends z.ZodType>(req: Request, schema: S): Promise<z.infer<S>> {
  const body: unknown = await req.json().catch(() => {
    throw new HttpError("bad_request", "Body must be valid JSON");
  });
  return schema.parse(body);
}

export function parseQuery<S extends z.ZodType>(req: Request, schema: S): z.infer<S> {
  return schema.parse(Object.fromEntries(new URL(req.url).searchParams));
}

/** Resolves the caller's workspace from the `x-workspace-key` header or throws 401. */
export async function requireWorkspace(req: Request): Promise<WorkspaceView> {
  const key = req.headers.get(WORKSPACE_KEY_HEADER);
  if (!key) throw new HttpError("unauthorized", "Missing workspace key");
  const view = await getRepository().findWorkspaceByKeyHash(hashKey(key));
  if (!view) throw new HttpError("unauthorized", "Unknown workspace key");
  return view;
}
