"use client";
// Owner: Yernur. Unexpected error inside the caregiver app; the header and nav stay usable.
import { StatePanel } from "@/components/layout/StatePanel";
import { frameCopy } from "@/components/layout/copy";
import { useLocale } from "@/lib/i18n/client";
import { Button } from "@/components/ui";

export default function AppError({ retry }: { error: unknown; retry: () => void }) {
  const { locale } = useLocale();
  const t = frameCopy(locale).states;
  return (
    <StatePanel
      title={t.appErrorTitle}
      body={<p>{t.appErrorBody}</p>}
      action={<Button onClick={() => retry()}>{t.tryAgain}</Button>}
      home={{ href: "/app", label: t.backToDashboard }}
    />
  );
}
