/**
 * Edge proxy. Owner: Nurali.
 * 1. Per-IP rate limits on AI and workspace-creation endpoints.
 * 2. Landing locale: resolves EN/RU/KZ for "/" so the root layout can set <html lang>.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { ApiErrorBody } from "@/shared/api";
import { LOCALE_COOKIE, LOCALE_HEADER, LOCALE_QUERY, resolveLocale } from "@/lib/i18n/locales";
import { createRateLimiter, RATE_LIMITS } from "@/server/rate-limit";

const check = createRateLimiter();

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Only the landing is translated today, so only "/" gets a non-English <html lang>. */
function withLandingLocale(request: NextRequest): NextResponse {
  const locale = resolveLocale({
    query: request.nextUrl.searchParams.get(LOCALE_QUERY),
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (pathname === "/") return withLandingLocale(request);

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
  matcher: ["/", "/api/ai/:path*", "/api/demo", "/api/workspaces"],
};
