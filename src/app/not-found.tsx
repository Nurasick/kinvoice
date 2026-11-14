// Owner: Yernur. 404 for any unknown URL.
import { Logo } from "@/components/layout/Logo";
import { StatePanel } from "@/components/layout/StatePanel";
import { frameCopy } from "@/components/layout/copy";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = frameCopy(await getRequestLocale()).states;
  return (
    <div className="flex flex-1 flex-col px-4 sm:px-8">
      <header className="mx-auto w-full max-w-5xl py-5">
        <Logo />
      </header>
      <main className="flex-1">
        <StatePanel
          title={t.notFoundTitle}
          body={<p>{t.notFoundBody}</p>}
          home={{ href: "/", label: t.home }}
        />
      </main>
    </div>
  );
}
