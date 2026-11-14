/** Human labels for categories, dates and months. Owner: Olzhas. */
import type { Locale } from "@/lib/i18n/locales";
import { logCopy } from "./copy";

const INTL_TAG: Record<Locale, string> = { en: "en-US", ru: "ru-RU", kk: "kk-KZ" };

export function categoryLabel(category: string, locale: Locale = "en"): string {
  return logCopy(locale).categories[category] ?? category;
}

function utcDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d ?? 1));
}

/**
 * Kazakh names spelled out: many browsers ship no Kazakh date data and print "M11 14, Sat".
 * Weekdays start on Sunday, like Date.getUTCDay().
 */
const KK_MONTHS = ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"];
const KK_WEEKDAYS = ["Жс", "Дс", "Сс", "Ср", "Бс", "Жм", "Сб"];

/** "2026-11-14" → "Sat, Nov 14" / "сб, 14 нояб." / "Сб, 14 қараша" (no timezone shift). */
export function shortDate(date: string, locale: Locale = "en"): string {
  const d = utcDate(date);
  if (locale === "kk") return `${KK_WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${KK_MONTHS[d.getUTCMonth()].toLowerCase()}`;
  return d.toLocaleDateString(INTL_TAG[locale], { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

/** "2026-11" → "November 2026" / "Ноябрь 2026" / "Қараша 2026". */
export function monthLabel(month: string, locale: Locale = "en"): string {
  const d = utcDate(month);
  if (locale === "en") return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  if (locale === "kk") return `${KK_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  const name = d.toLocaleDateString(INTL_TAG[locale], { month: "long", timeZone: "UTC" });
  return `${name.charAt(0).toLocaleUpperCase(INTL_TAG[locale])}${name.slice(1)} ${d.getUTCFullYear()}`;
}

/** Shift "YYYY-MM" by `delta` months. */
export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
