/**
 * Which language the AI writes in. Owner: Olzhas.
 * Money is always USD; only the words change.
 */
import { isLocale, LOCALE_COOKIE, resolveLocale, type Locale } from "@/lib/i18n/locales";

/** Language names as the model should read them. */
export const LANGUAGE_NAME: Record<Locale, string> = { en: "English", ru: "Russian", kk: "Kazakh" };

/** The product's wording for the ask, per language (never "owe"). */
export const CONTRIBUTION_PHRASE: Record<Locale, string> = {
  en: "suggested contribution",
  ru: "предлагаемый вклад",
  kk: "ұсынылған үлес",
};

/**
 * Reads an optional `locale` field from an AI input. The frozen AiService inputs
 * don't declare it yet, so anything other than a supported locale means English.
 */
export function localeOf(input: object): Locale {
  const value = "locale" in input ? input.locale : undefined;
  return isLocale(value) ? value : "en";
}

function cookieValue(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** Explicit body value wins, then the app's language cookie, then the browser, then English. */
export function requestLocale(req: Request, explicit?: unknown): Locale {
  if (isLocale(explicit)) return explicit;
  return resolveLocale({
    cookie: cookieValue(req.headers.get("cookie"), LOCALE_COOKIE),
    acceptLanguage: req.headers.get("accept-language"),
  });
}
