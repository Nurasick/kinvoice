"use client";
/**
 * EN / RU / KZ for the sibling page. Unlike the landing switcher it keeps `?for=` so a personal
 * link still opens on that sibling's amount. Plain links work without JS; JS also remembers the choice.
 */
import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";
import { LOCALES, LOCALE_LABELS, LOCALE_QUERY, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/components/ui";

export interface LocaleSwitchProps {
  current: Locale;
  label: string;
  /** Member id from a personal link, preserved across language changes. */
  forMember: string | null;
}

export function LocaleSwitch({ current, label, forMember }: LocaleSwitchProps) {
  const { rememberLocale } = useLocale();
  return (
    <nav aria-label={label} className="flex gap-1 rounded-full bg-enamel-deep/60 p-1">
      {LOCALES.map((locale) => {
        const query = new URLSearchParams({ [LOCALE_QUERY]: locale });
        if (forMember) query.set("for", forMember);
        return (
          <Link
            key={locale}
            href={`?${query.toString()}`}
            scroll={false}
            prefetch={false}
            replace
            onClick={() => rememberLocale(locale)}
            aria-current={locale === current ? "true" : undefined}
            hrefLang={locale}
            lang={locale}
            title={LOCALE_LABELS[locale].name}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
              locale === current ? "bg-white text-enamel-deep" : "text-on-enamel-soft hover:text-white",
            )}
          >
            {LOCALE_LABELS[locale].short}
          </Link>
        );
      })}
    </nav>
  );
}
