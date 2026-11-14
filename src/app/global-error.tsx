"use client";
// Owner: Yernur. Last resort when the root layout itself fails: renders its own document.
import "./globals.css";
import { frameCopy } from "@/components/layout/copy";
import { LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n/locales";

/** No providers here (this replaces the root layout), so read the remembered language directly. */
function cookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  return match && isLocale(match[1]) ? match[1] : "en";
}

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  const locale = cookieLocale();
  const t = frameCopy(locale).states;
  return (
    <html lang={locale}>
      <body className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
        <title>Kinvoice</title>
        <main className="flex max-w-md flex-col gap-4">
          <h1 className="font-display text-3xl font-medium">{t.globalTitle}</h1>
          <p className="text-ink-soft">{t.globalBody}</p>
          <div>
            <button
              type="button"
              onClick={() => retry()}
              className="h-10 rounded-[var(--radius-control)] bg-accent px-4 text-sm font-medium text-accent-ink"
            >
              {t.tryAgain}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
