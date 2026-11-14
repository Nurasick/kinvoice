/**
 * Locale-aware formatting for words around numbers. Money itself always uses formatCents (USD).
 */
import type { Locale } from "./locales";

/** Non-breaking space: "16 ч" must never wrap between the number and its unit. */
const NBSP = " ";

const UNITS: Record<Locale, { h: string; m: string }> = {
  en: { h: "h", m: "m" },
  ru: { h: `${NBSP}ч`, m: `${NBSP}мин` },
  kk: { h: `${NBSP}сағ`, m: `${NBSP}мин` },
};

/** 1005 → "16h 45m" / "16 ч 45 мин" / "16 сағ 45 мин" (non-breaking spaces); 45 → "45m"; 180 → "3h". */
export function formatDuration(minutes: number, locale: Locale): string {
  const u = UNITS[locale];
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}${u.m}`;
  if (m === 0) return `${h}${u.h}`;
  return `${h}${u.h}${NBSP}${m}${u.m}`;
}

const INTL_TAG: Record<Locale, string> = { en: "en-US", ru: "ru-RU", kk: "kk-KZ" };

/** Stand-alone month name for headings: "November" / "Ноябрь" / "Қараша". */
export function monthName(date: Date, locale: Locale): string {
  const name = new Intl.DateTimeFormat(INTL_TAG[locale], { month: "long", timeZone: "UTC" }).format(date);
  return name.charAt(0).toLocaleUpperCase(INTL_TAG[locale]) + name.slice(1);
}
