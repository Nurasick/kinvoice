"use client";
/**
 * Log page: quick log, receipt, manual entry, this month's entries. Owner: Olzhas.
 * Workspace + key come from Yernur's WorkspaceProvider (app layout).
 * AI failure never shows an error page — it opens the manual card instead.
 */
import { useState } from "react";
import { Button, Card, CardHeader, EmptyState, LoadingBlock } from "@/components/ui";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { localToday } from "./draft-form";
import { DraftsPanel } from "./DraftsPanel";
import { EntryList } from "./EntryList";
import { monthLabel, shiftMonth } from "./labels";
import { Notice } from "./Notice";
import { QuickLogBox } from "./QuickLogBox";
import { ReceiptUpload } from "./ReceiptUpload";
import { useAiActions } from "./use-ai-actions";
import { useDrafts } from "./use-drafts";
import { useEntries, type EntriesData } from "./use-entries";

function MonthPicker({ month, onChange }: { month: string; onChange: (m: string) => void }) {
  const current = localToday().slice(0, 7);
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))}>‹</Button>
      <span className="min-w-32 text-center text-sm font-medium text-ink-soft">{monthLabel(month)}</span>
      <Button variant="ghost" size="sm" aria-label="Next month" disabled={month >= current} onClick={() => onChange(shiftMonth(month, 1))}>›</Button>
    </div>
  );
}

function Entries({ data, month }: { data: EntriesData; month: string }) {
  const { api, view } = useWorkspace();
  if (data.state === "loading") return <LoadingBlock label={`Loading ${monthLabel(month)}`} />;
  if (data.state === "error") {
    return (
      <EmptyState
        title="We couldn't load your entries"
        description="Your data is safe. This is usually a brief connection hiccup."
        action={<Button onClick={() => void data.reload()}>Try again</Button>}
      />
    );
  }
  return <EntryList api={api} entries={data.entries} members={view.members} onChanged={data.reload} />;
}

export function LogScreen() {
  const { api, view, caregiver } = useWorkspace();
  const [month, setMonth] = useState(() => localToday().slice(0, 7));
  const data = useEntries(api, month);
  const drafts = useDrafts(api, caregiver.id, data.reload);
  const { quickLog, receipt } = useAiActions(api, drafts);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <QuickLogBox onSubmit={quickLog} />
        <div className="flex flex-col gap-4">
          <ReceiptUpload onFile={receipt} />
          <Card>
            <CardHeader title="Prefer a form?" />
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => drafts.addEmpty("expense")}>Add expense</Button>
              <Button variant="secondary" onClick={() => drafts.addEmpty("time")}>Add time</Button>
            </div>
          </Card>
        </div>
      </div>
      {drafts.notice ? <Notice tone={drafts.notice.tone}>{drafts.notice.text}</Notice> : null}
      <DraftsPanel drafts={drafts} members={view.members} />
      <section aria-labelledby="entries-title" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="entries-title" className="font-display text-xl font-medium text-ink">Logged entries</h2>
          <MonthPicker month={month} onChange={setMonth} />
        </div>
        <Entries data={data} month={month} />
      </section>
    </div>
  );
}
