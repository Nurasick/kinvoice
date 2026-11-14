/**
 * UI language for server components. Owner: Nurali.
 * The proxy has already resolved ?lang → cookie → browser → English for this request; this reads
 * that answer, and resolves it again only if the proxy didn't run (e.g. in tests).
 */
import "server-only";
import { cookies, headers } from "next/headers";
import { isLocale, LOCALE_COOKIE, LOCALE_HEADER, resolveLocale, type Locale } from "./locales";

export async function getRequestLocale(): Promise<Locale> {
  const [h, jar] = await Promise.all([headers(), cookies()]);
  const fromProxy = h.get(LOCALE_HEADER);
  if (isLocale(fromProxy)) return fromProxy;
  return resolveLocale({ cookie: jar.get(LOCALE_COOKIE)?.value, acceptLanguage: h.get("accept-language") });
}
