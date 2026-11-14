"use client";
import type { MonthlyBalance } from "@/shared/domain";
import { useLocale } from "@/lib/i18n/client";
import { Button, Card, Field, Spinner, Textarea } from "@/components/ui";
import { invoiceCopy } from "./copy";
import { ContributionPreview } from "./ContributionPreview";
import { TonePicker } from "./TonePicker";
import type { Composer } from "./use-composer";

export interface ComposerCardProps {
  composer: Composer;
  balance: MonthlyBalance;
  /** Publish date label of an invoice already sent for this month, if any. */
  alreadySentOn?: string;
}

/** Tone → AI draft → edit → publish. Nothing leaves until she presses Publish. */
export function ComposerCard({ composer: c, balance, alreadySentOn }: ComposerCardProps) {
  const { locale } = useLocale();
  const t = invoiceCopy(locale).composer;
  return (
    <Card className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex min-w-0 flex-col gap-5">
        {alreadySentOn && (
          <p className="rounded-[var(--radius-control)] bg-warning-soft px-3 py-2 text-sm text-warning">
            {t.alreadySent({ date: alreadySentOn })}
          </p>
        )}
        <TonePicker value={c.tone} onChange={c.setTone} disabled={c.isDrafting || c.isPublishing} />
        <Field label={t.messageLabel} hint={c.isTemplate ? t.templateHint : t.draftHint}>
          {(p) => (
            <div className="relative">
              <Textarea
                {...p}
                rows={10}
                value={c.message}
                onChange={(e) => c.setMessage(e.target.value)}
                disabled={c.isDrafting}
                maxLength={4000}
                placeholder={t.placeholder}
              />
              {c.isDrafting && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-surface/80 text-sm text-ink-muted">
                  <Spinner size="sm" label="" /> {t.drafting}
                </div>
              )}
            </div>
          )}
        </Field>
        {c.error && (
          <p role="alert" className="text-sm text-danger">
            {t.errors[c.error]}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="lg"
            onClick={() => void c.publish()}
            isLoading={c.isPublishing}
            disabled={c.isDrafting}
          >
            {t.publish}
          </Button>
          <Button variant="ghost" onClick={c.redraft} disabled={c.isDrafting || c.isPublishing}>
            {t.redraft}
          </Button>
        </div>
      </div>
      <div className="rounded-[var(--radius-control)] bg-paper p-5">
        <ContributionPreview balance={balance} locale={locale} />
      </div>
    </Card>
  );
}
