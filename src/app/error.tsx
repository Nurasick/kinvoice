"use client";
// Owner: Yernur. Unexpected error outside the caregiver app (landing, setup, public invoice).
import { Logo } from "@/components/layout/Logo";
import { StatePanel } from "@/components/layout/StatePanel";
import { frameCopy } from "@/components/layout/copy";
import { useLocale } from "@/lib/i18n/client";
import { Button } from "@/components/ui";

export default function RootError({ retry }: { error: unknown; retry: () => void }) {
  const { locale } = useLocale();
  const t = frameCopy(locale).states;
  return (
    <div className="flex flex-1 flex-col px-4 sm:px-8">
      <header className="mx-auto w-full max-w-5xl py-5">
        <Logo />
      </header>
      <main className="flex-1">
        <StatePanel
          title={t.errorTitle}
          body={<p>{t.errorBody}</p>}
          action={<Button onClick={() => retry()}>{t.tryAgain}</Button>}
          home={{ href: "/", label: t.home }}
        />
      </main>
    </div>
  );
}
