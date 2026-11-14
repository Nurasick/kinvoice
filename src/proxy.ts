/**
 * Edge proxy. Owner: Nurali.
 * 1. Pages: resolves the UI language once (?lang → cookie → browser → English), hands it to the
 *    root layout in a request header, and remembers a ?lang= choice in the cookie. So one choice
 *    carries across the landing, the app and the sibling page.
 * 2. API: per-IP rate limits on AI and workspace-creation endpoints.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { ApiErrorBody } from "@/shared/api";
import {
  decideLocale,
  isPageLoad,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_HEADER,
  LOCALE_QUERY,
} from "@/lib/i18n/locales";
import { createRateLimiter, RATE_LIMITS } from "@/server/rate-limit";

const check = createRateLimiter();

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function withLocale(request: NextRequest): NextResponse {
  const { locale, shouldPersist } = decideLocale({
    query: request.nextUrl.searchParams.get(LOCALE_QUERY),
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    isPageLoad: isPageLoad(request.headers),
  });
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  const response = NextResponse.next({ request: { headers } });
  if (shouldPersist) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
  }
  return response;
}

function rateLimited(request: NextRequest): NextResponse {
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

export function proxy(request: NextRequest): NextResponse {
  return request.nextUrl.pathname.startsWith("/api/") ? rateLimited(request) : withLocale(request);
}

export const config = {
  matcher: [
    // every page, but not the API, Next internals or static files
    "/((?!api/|_next/|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)",
    "/api/ai/:path*",
    "/api/demo",
    "/api/workspaces",
  ],
};
