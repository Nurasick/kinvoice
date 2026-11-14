// Owner: Olzhas. Log care: quick log, receipt, manual form, this month's entries. EN / RU / KZ.
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { logCopy } from "@/components/log/copy";
import { LogScreen } from "@/components/log/LogScreen";
import { LOCALE_COOKIE, LOCALE_QUERY, resolveLocale, type Locale } from "@/lib/i18n/locales";

/** ?lang wins, then the remembered cookie, then the browser, then English (same rule as the landing). */
async function currentLocale(searchParams: PageProps<"/app/log">["searchParams"]): Promise<Locale> {
  const [params, jar, h] = await Promise.all([searchParams, cookies(), headers()]);
  return resolveLocale({
    query: params[LOCALE_QUERY],
    cookie: jar.get(LOCALE_COOKIE)?.value,
    acceptLanguage: h.get("accept-language"),
  });
}

export async function generateMetadata({ searchParams }: PageProps<"/app/log">): Promise<Metadata> {
  return { title: `${logCopy(await currentLocale(searchParams)).page.title} · Kinvoice` };
}

export default async function LogPage({ searchParams }: PageProps<"/app/log">) {
  const locale = await currentLocale(searchParams);
  const { page } = logCopy(locale);
  return (
    <div lang={locale}>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-medium text-ink">{page.title}</h1>
        <p className="mt-1 text-ink-muted">{page.subtitle}</p>
      </header>
      <LogScreen locale={locale} />
    </div>
  );
}
