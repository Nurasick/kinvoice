/**
 * Supported UI languages. Owner: Nurali.
 * Money stays in USD everywhere (US product); only words and dates change.
 * Add a surface's strings as its own dictionary next to the surface (see components/landing/copy.ts).
 */
export const LOCALES = ["en", "ru", "kk"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "lang";
export const LOCALE_QUERY = "lang";
/** Request header the proxy sets with the resolved landing locale (read by the root layout for <html lang>). */
export const LOCALE_HEADER = "x-kinvoice-locale";

/** What the switcher shows. Kazakh is labelled KZ, the way people in Kazakhstan write it. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ru: { short: "RU", name: "Русский" },
  kk: { short: "KZ", name: "Қазақша" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Accepts "kz" as an alias for Kazakh, since people type the country code. */
function normalize(value: string | null | undefined): Locale | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "kz") return "kk";
  return isLocale(v) ? v : null;
}

/** First supported language in an Accept-Language header ("ru-RU,ru;q=0.9,en;q=0.8" → "ru"). */
export function fromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.split("-")[0], q: q === undefined ? 1 : Number(q) };
    })
    .filter((x) => x.base && !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q);
  for (const { base } of ranked) {
    const hit = normalize(base);
    if (hit) return hit;
  }
  return null;
}

/** Explicit choice (URL) wins, then the remembered cookie, then the browser, then English. */
export function resolveLocale(input: {
  query?: string | string[] | null;
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const query = Array.isArray(input.query) ? input.query[0] : input.query;
  return (
    normalize(query) ?? normalize(input.cookie) ?? fromAcceptLanguage(input.acceptLanguage) ?? DEFAULT_LOCALE
  );
}

/** How long the language choice is remembered. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface LocaleDecision {
  locale: Locale;
  /** The URL chose a language the cookie doesn't hold yet: remember it. */
  shouldPersist: boolean;
}

/** What the proxy decides for one page request. Same order as resolveLocale. */
export function decideLocale(input: {
  query?: string | null;
  cookie?: string | null;
  acceptLanguage?: string | null;
}): LocaleDecision {
  const locale = resolveLocale(input);
  const fromQuery = normalize(input.query);
  return { locale, shouldPersist: fromQuery !== null && fromQuery !== normalize(input.cookie) };
}

/** "/i/abc?for=m1" + "ru" → "/i/abc?for=m1&lang=ru". Keeps every other parameter and the hash. */
export function withLocale(pathAndQuery: string, locale: Locale): string {
  const url = new URL(pathAndQuery, "http://local");
  url.searchParams.set(LOCALE_QUERY, locale);
  return `${url.pathname}${url.search}${url.hash}`;
}
