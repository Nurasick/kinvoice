// Owner: Olzhas. Log care: quick log, receipt, manual form, this month's entries. EN / RU / KZ.
import type { Metadata } from "next";
import { logCopy } from "@/components/log/copy";
import { LogScreen } from "@/components/log/LogScreen";
import { getRequestLocale } from "@/lib/i18n/server";

/** Language: resolved once per request by the proxy (?lang → cookie → browser → English), see N2. */
export async function generateMetadata(): Promise<Metadata> {
  return { title: `${logCopy(await getRequestLocale()).page.title} · Kinvoice` };
}

export default async function LogPage() {
  const { page } = logCopy(await getRequestLocale());
  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-medium text-ink">{page.title}</h1>
        <p className="mt-1 text-ink-muted">{page.subtitle}</p>
      </header>
      <LogScreen />
    </>
  );
}
