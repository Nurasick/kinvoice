"use client";
import Link from "next/link";
import { editLink } from "@/lib/workspace-key";
import { useLocale } from "@/lib/i18n/client";
import { Card, CopyButton, buttonClass, useOrigin } from "@/components/ui";
import { setupCopy } from "./copy";

/** Shown once after setup: the private edit link is the only way back in from another device. */
export function SetupDone({ editKey }: { editKey: string }) {
  const origin = useOrigin();
  const link = editLink(origin, editKey);
  const { locale } = useLocale();
  const t = setupCopy(locale).done;

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl font-medium">{t.title}</h1>
        <p className="mt-1 text-sm font-medium text-success">{t.ready}</p>
        <p className="mt-3 max-w-xl text-ink-soft">{t.body}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 truncate rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink-soft">
          {link}
        </code>
        <CopyButton value={link} label={t.copyLink} copiedLabel={t.copied} size="lg" />
      </div>
      <div>
        <Link href="/app" className={buttonClass("primary", "lg")}>
          {t.toDashboard}
        </Link>
      </div>
    </Card>
  );
}
