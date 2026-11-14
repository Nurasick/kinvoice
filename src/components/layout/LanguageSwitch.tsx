"use client";
/**
 * EN / RU / KZ for the app header (on the enamel band). Owner: Nurali (N2).
 * One switch for the whole product: the choice is remembered and applies to the landing,
 * the caregiver app and the sibling page.
 */
import { useLocale } from "@/lib/i18n/client";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/locales";
import { cn } from "@/components/ui";

export function LanguageSwitch({ label = "Language" }: { label?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-full bg-enamel-deep/60 p-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          lang={l}
          title={LOCALE_LABELS[l].name}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
            l === locale ? "bg-white text-enamel-deep" : "text-on-enamel-soft hover:text-white",
          )}
        >
          {LOCALE_LABELS[l].short}
        </button>
      ))}
    </div>
  );
}
