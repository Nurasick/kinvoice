"use client";
/** EN / RU / KZ. Works without JS (plain ?lang= links); with JS it also remembers the choice in a cookie. */
import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";
import { LOCALES, LOCALE_LABELS, LOCALE_QUERY, type Locale } from "@/lib/i18n/locales";
import s from "./landing.module.css";

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const { rememberLocale } = useLocale();
  return (
    <nav aria-label={label} className={s.lang}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`?${LOCALE_QUERY}=${locale}`}
          scroll={false}
          prefetch={false}
          onClick={() => rememberLocale(locale)}
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
