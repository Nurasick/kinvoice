"use client";
/** AI drafts + manual cards awaiting confirmation. Owner: Olzhas. */
import type { Member } from "@/shared/domain";
import { Button } from "@/components/ui";
import type { DraftForm } from "./draft-form";
import { EntryCard } from "./EntryCard";
import type { DraftsState } from "./use-drafts";

const BADGES: Record<DraftForm["source"], string> = {
  quick_log: "From your note",
  receipt: "From your receipt",
  manual: "New entry",
};

export function DraftsPanel({ drafts, members }: { drafts: DraftsState; members: readonly Member[] }) {
  const { forms, errors, saving } = drafts;
  if (forms.length === 0) return null;
  const count = forms.length;
  return (
    <section aria-labelledby="drafts-title" className="flex flex-col gap-4">
      <div>
        <h2 id="drafts-title" className="font-display text-xl font-medium text-ink">Check and confirm</h2>
        <p className="text-sm text-ink-muted">Nothing is saved until you confirm. Edit anything that looks off.</p>
      </div>
      {forms.map((form) => (
        <EntryCard
          key={form.key}
          form={form}
          members={members}
          errors={errors[form.key]}
          badge={BADGES[form.source]}
          onChange={drafts.update}
          actions={
            <Button variant="ghost" size="sm" onClick={() => drafts.discard(form.key)} disabled={saving}>
              Discard
            </Button>
          }
        />
      ))}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="ghost" onClick={drafts.discardAll} disabled={saving}>
          Discard all
        </Button>
        <Button size="lg" isLoading={saving} onClick={() => void drafts.confirmAll()}>
          {count === 1 ? "Confirm entry" : `Confirm all ${count}`}
        </Button>
      </div>
    </section>
  );
}
