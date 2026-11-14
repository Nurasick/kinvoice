/**
 * Edge proxy: per-IP rate limits on AI and workspace-creation endpoints. Owner: Nurali.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { ApiErrorBody } from "@/shared/api";
import { createRateLimiter, RATE_LIMITS } from "@/server/rate-limit";

const check = createRateLimiter();

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const match = RATE_LIMITS.find((r) => pathname.startsWith(r.prefix));
  if (!match || request.method === "GET") return NextResponse.next();

  const result = check(`${match.prefix}:${clientIp(request)}`, match.rule);
  if (result.isAllowed) return NextResponse.next();

  const body: ApiErrorBody = {
    error: { code: "rate_limited", message: "Too many requests. Please wait a moment and try again." },
  };
  return NextResponse.json(body, { status: 429, headers: { "retry-after": String(result.retryAfterSeconds) } });
}

export const config = {
  matcher: ["/api/ai/:path*", "/api/demo", "/api/workspaces"],
};
