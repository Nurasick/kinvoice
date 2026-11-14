"use client";
/** AI drafts + manual cards awaiting confirmation. Owner: Olzhas. */
import type { Member } from "@/shared/domain";
import type { DraftForm } from "./draft-form";
import { EntryCard } from "./EntryCard";
import { Button, Spinner } from "./ui";
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
        <h2 id="drafts-title" className="text-lg font-semibold">Check and confirm</h2>
        <p className="text-sm opacity-70">Nothing is saved until you confirm. Edit anything that looks off.</p>
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
            <Button variant="ghost" onClick={() => drafts.discard(form.key)} disabled={saving}>
              Discard
            </Button>
          }
        />
      ))}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="outside" onClick={drafts.discardAll} disabled={saving}>
          Discard all
        </Button>
        {saving ? (
          <Spinner label="Saving…" />
        ) : (
          <Button onClick={() => void drafts.confirmAll()}>{count === 1 ? "Confirm entry" : `Confirm all ${count}`}</Button>
        )}
      </div>
    </section>
  );
}
