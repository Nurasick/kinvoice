// Owner: Yernur. Shown while the public invoice is fetched on the server.
// No query string here, so the language comes from the remembered cookie or the browser.
import { cookies, headers } from "next/headers";
import { Logo } from "@/components/layout/Logo";
import { siblingCopy } from "@/components/public-invoice/copy";
import { LoadingBlock } from "@/components/ui";
import { LOCALE_COOKIE, resolveLocale } from "@/lib/i18n/locales";

export default async function PublicInvoiceLoading() {
  const [jar, h] = await Promise.all([cookies(), headers()]);
  const locale = resolveLocale({
    cookie: jar.get(LOCALE_COOKIE)?.value,
    acceptLanguage: h.get("accept-language"),
  });
  return (
    <div lang={locale} className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-8">
        <LoadingBlock label={siblingCopy(locale).loading} />
      </main>
    </div>
  );
}
