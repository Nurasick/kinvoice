"use client";
/**
 * Log page: quick log, receipt, manual entry, this month's entries. Owner: Olzhas.
 * Workspace + key come from Yernur's WorkspaceProvider (app layout); words from copy.ts.
 * AI failure never shows an error page — it opens the manual card instead.
 */
import { useState } from "react";
import { useLocale } from "@/lib/i18n/client";
import { Button, Card, CardHeader, EmptyState, LoadingBlock } from "@/components/ui";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { LogCopyProvider, useLogCopy } from "./copy-context";
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
  const { t, locale } = useLogCopy();
  const current = localToday().slice(0, 7);
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" aria-label={t.list.prevMonth} onClick={() => onChange(shiftMonth(month, -1))}>‹</Button>
      <span className="min-w-32 text-center text-sm font-medium text-ink-soft">{monthLabel(month, locale)}</span>
      <Button variant="ghost" size="sm" aria-label={t.list.nextMonth} disabled={month >= current} onClick={() => onChange(shiftMonth(month, 1))}>›</Button>
    </div>
  );
}

function Entries({ data, month }: { data: EntriesData; month: string }) {
  const { api, view } = useWorkspace();
  const { t, locale } = useLogCopy();
  if (data.state === "loading") return <LoadingBlock label={t.list.loading(monthLabel(month, locale))} />;
  if (data.state === "error") {
    return (
      <EmptyState
        title={t.list.loadErrorTitle}
        description={t.list.loadErrorHint}
        action={<Button onClick={() => void data.reload()}>{t.list.retry}</Button>}
      />
    );
  }
  return <EntryList api={api} entries={data.entries} members={view.members} onChanged={data.reload} />;
}

function LogBody() {
  const { api, view, caregiver } = useWorkspace();
  const { t } = useLogCopy();
  const [month, setMonth] = useState(() => localToday().slice(0, 7));
  const data = useEntries(api, month);
  const drafts = useDrafts(api, caregiver.id, data.reload, t);
  const { quickLog, receipt } = useAiActions(api, drafts, t);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <QuickLogBox onSubmit={quickLog} />
        <div className="flex flex-col gap-4">
          <ReceiptUpload onFile={receipt} />
          <Card>
            <CardHeader title={t.form.title} />
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => drafts.addEmpty("expense")}>{t.form.addExpense}</Button>
              <Button variant="secondary" onClick={() => drafts.addEmpty("time")}>{t.form.addTime}</Button>
            </div>
          </Card>
        </div>
      </div>
      {drafts.notice ? <Notice tone={drafts.notice.tone}>{drafts.notice.text}</Notice> : null}
      <DraftsPanel drafts={drafts} members={view.members} />
      <section aria-labelledby="entries-title" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="entries-title" className="font-display text-xl font-medium text-ink">{t.list.title}</h2>
          <MonthPicker month={month} onChange={setMonth} />
        </div>
        <Entries data={data} month={month} />
      </section>
    </div>
  );
}

/** The language comes from Nurali's app-wide LocaleProvider, so the header switch updates this screen. */
export function LogScreen() {
  const { locale } = useLocale();
  return (
    <LogCopyProvider locale={locale}>
      <LogBody />
    </LogCopyProvider>
  );
}
