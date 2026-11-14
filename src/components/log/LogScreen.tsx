"use client";
/**
 * Log page: quick log, receipt, manual entry, this month's entries. Owner: Olzhas.
 * AI failure never shows an error page — it opens the manual card instead.
 */
import Link from "next/link";
import { useState } from "react";
import { localToday } from "./draft-form";
import { DraftsPanel } from "./DraftsPanel";
import { EntryList } from "./EntryList";
import { monthLabel, shiftMonth } from "./labels";
import { QuickLogBox } from "./QuickLogBox";
import { ReceiptUpload } from "./ReceiptUpload";
import { Button, Card, Notice, Spinner } from "./ui";
import { useAiActions } from "./use-ai-actions";
import { useDrafts } from "./use-drafts";
import { useLogData, useWorkspaceKey } from "./use-log-data";

function NoWorkspace() {
  return (
    <Card className="flex flex-col items-start gap-3">
      <h2 className="text-lg font-semibold text-stone-900">Open your family space first</h2>
      <p className="text-sm text-stone-600">Use your private edit link, try the demo family, or set up your own.</p>
      <Link href="/" className="text-sm font-medium text-teal-800 underline underline-offset-2">Go to the start page</Link>
    </Card>
  );
}

function MonthPicker({ month, onChange }: { month: string; onChange: (m: string) => void }) {
  const current = localToday().slice(0, 7);
  return (
    <div className="flex items-center gap-1">
      <Button variant="outside" className="px-2 py-1" aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))}>‹</Button>
      <span className="min-w-32 text-center text-sm font-medium">{monthLabel(month)}</span>
      <Button variant="outside" className="px-2 py-1" aria-label="Next month" disabled={month >= current} onClick={() => onChange(shiftMonth(month, 1))}>›</Button>
    </div>
  );
}

export function LogScreen() {
  const key = useWorkspaceKey();
  const [month, setMonth] = useState(() => localToday().slice(0, 7));
  const data = useLogData(key, month);
  const drafts = useDrafts(data.api, data.view, data.reload);
  const { quickLog, receipt } = useAiActions(data.api, drafts);

  if (key === undefined) return <Spinner label="Loading…" />;
  if (data.state === "unauthorized") return <NoWorkspace />;
  if (data.state === "error") return <Notice tone="warn">We couldn&apos;t load your entries. Check your connection and refresh the page.</Notice>;
  if (data.state === "loading" || !data.view || !data.api) return <Spinner label="Loading your month…" />;

  const members = data.view.members;
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <QuickLogBox onSubmit={quickLog} />
        <div className="flex flex-col gap-4">
          <ReceiptUpload onFile={receipt} />
          <Card className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-stone-900">Prefer a form?</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => drafts.addEmpty("expense")}>Add expense</Button>
              <Button variant="secondary" onClick={() => drafts.addEmpty("time")}>Add time</Button>
            </div>
          </Card>
        </div>
      </div>
      {drafts.notice ? <Notice tone={drafts.notice.tone}>{drafts.notice.text}</Notice> : null}
      <DraftsPanel drafts={drafts} members={members} />
      <section aria-labelledby="entries-title" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="entries-title" className="text-lg font-semibold">Logged entries</h2>
          <MonthPicker month={month} onChange={setMonth} />
        </div>
        <EntryList api={data.api} entries={data.entries} members={members} onChanged={data.reload} />
      </section>
    </div>
  );
}
