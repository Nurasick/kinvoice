"use client";
/** AI drafts + manual cards awaiting confirmation. Owner: Olzhas. */
import type { Member } from "@/shared/domain";
import { Button } from "@/components/ui";
import { useLogCopy } from "./copy-context";
import { EntryCard } from "./EntryCard";
import type { DraftsState } from "./use-drafts";

export function DraftsPanel({ drafts, members }: { drafts: DraftsState; members: readonly Member[] }) {
  const { t } = useLogCopy();
  const { forms, errors, saving } = drafts;
  if (forms.length === 0) return null;
  const count = forms.length;
  const expenses = forms.filter((f) => f.kind === "expense").length;
  return (
    <section aria-labelledby="drafts-title" className="flex flex-col gap-4">
      <div>
        <h2 id="drafts-title" className="font-display text-xl font-medium text-ink">{t.drafts.title}</h2>
        <p className="text-sm text-ink-muted">{t.drafts.hint}</p>
        <p className="mt-2 text-sm text-ink-soft" aria-live="polite">
          {t.drafts.summary(expenses, count - expenses)}
        </p>
      </div>
      {forms.map((form) => (
        <EntryCard
          key={form.key}
          form={form}
          members={members}
          errors={errors[form.key]}
          badge={t.drafts.badge[form.source]}
          onChange={drafts.update}
          actions={
            <Button variant="ghost" size="sm" onClick={() => drafts.discard(form.key)} disabled={saving}>
              {t.drafts.discard}
            </Button>
          }
        />
      ))}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="ghost" onClick={drafts.discardAll} disabled={saving}>
          {t.drafts.discardAll}
        </Button>
        <Button size="lg" isLoading={saving} onClick={() => void drafts.confirmAll()}>
          {count === 1 ? t.drafts.confirmOne : t.drafts.confirmAll(count)}
        </Button>
      </div>
    </section>
  );
}
