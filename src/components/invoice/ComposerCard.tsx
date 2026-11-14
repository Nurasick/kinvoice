"use client";
import type { MonthlyBalance } from "@/shared/domain";
import { Button, Card, Field, Spinner, Textarea } from "@/components/ui";
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
  return (
    <Card className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex min-w-0 flex-col gap-5">
        {alreadySentOn && (
          <p className="rounded-[var(--radius-control)] bg-warning-soft px-3 py-2 text-sm text-warning">
            You already sent an invoice for this month on {alreadySentOn}. Publishing again creates a new
            link; the old one keeps working.
          </p>
        )}
        <TonePicker value={c.tone} onChange={c.setTone} disabled={c.isDrafting || c.isPublishing} />
        <Field
          label="Message to your siblings"
          hint={
            c.isTemplate
              ? "This is our standard wording. Make it your own, or try another tone."
              : "Drafted from this month’s real numbers. Edit anything before you publish."
          }
        >
          {(p) => (
            <div className="relative">
              <Textarea
                {...p}
                rows={10}
                value={c.message}
                onChange={(e) => c.setMessage(e.target.value)}
                disabled={c.isDrafting}
                maxLength={4000}
                placeholder="A short update for your siblings…"
              />
              {c.isDrafting && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-surface/80 text-sm text-ink-muted">
                  <Spinner size="sm" label="" /> Writing a draft…
                </div>
              )}
            </div>
          )}
        </Field>
        {c.error && (
          <p role="alert" className="text-sm text-danger">
            {c.error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="lg"
            onClick={() => void c.publish()}
            isLoading={c.isPublishing}
            disabled={c.isDrafting}
          >
            Publish and get link
          </Button>
          <Button variant="ghost" onClick={c.redraft} disabled={c.isDrafting || c.isPublishing}>
            Redraft
          </Button>
        </div>
      </div>
      <div className="rounded-[var(--radius-control)] bg-paper p-5">
        <ContributionPreview balance={balance} />
      </div>
    </Card>
  );
}
