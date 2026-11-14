"use client";
/** EN / RU / KZ. Works without JS (plain ?lang= links); with JS it also remembers the choice in a cookie. */
import Link from "next/link";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, LOCALE_QUERY, type Locale } from "@/lib/i18n/locales";
import s from "./landing.module.css";

const ONE_YEAR = 60 * 60 * 24 * 365;

function remember(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  return (
    <nav aria-label={label} className={s.lang}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`?${LOCALE_QUERY}=${locale}`}
          scroll={false}
          onClick={() => remember(locale)}
          className={s.langItem}
          aria-current={locale === current ? "true" : undefined}
          hrefLang={locale}
          lang={locale}
          title={LOCALE_LABELS[locale].name}
        >
          {LOCALE_LABELS[locale].short}
        </Link>
      ))}
    </nav>
  );
}
