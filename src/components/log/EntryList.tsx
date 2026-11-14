"use client";
/** This month's saved entries with inline edit and delete. Owner: Olzhas. */
import { useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import type { Entry, Member } from "@/shared/domain";
import { Button, Card, EmptyState, Money } from "@/components/ui";
import { formatDuration } from "@/lib/i18n/format";
import { useLogCopy } from "./copy-context";
import { entryToForm, formToNewEntry, type DraftForm, type FormErrors } from "./draft-form";
import { EntryCard } from "./EntryCard";
import { categoryLabel, shortDate } from "./labels";

interface Props {
  api: WorkspaceApi;
  entries: readonly Entry[];
  members: readonly Member[];
  onChanged: () => Promise<void>;
}

function EditEntry({ api, entry, members, onDone }: { api: WorkspaceApi; entry: Entry; members: readonly Member[]; onDone: (saved: boolean) => void }) {
  const { t } = useLogCopy();
  const [form, setForm] = useState<DraftForm>(() => entryToForm(entry));
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);

  async function save() {
    const result = formToNewEntry(form, t.errors);
    if (!result.ok) return setErrors(result.errors);
    setBusy(true);
    try {
      await api.updateEntry(entry.id, result.entry);
      onDone(true);
    } catch {
      setErrors({ note: t.list.saveError });
      setBusy(false);
    }
  }

  return (
    <EntryCard
      flat
      form={form}
      members={members}
      errors={errors}
      onChange={setForm}
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={() => onDone(false)} disabled={busy}>{t.list.cancel}</Button>
          <Button size="sm" isLoading={busy} onClick={() => void save()}>{t.list.save}</Button>
        </>
      }
    />
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => Promise<void> }) {
  const { t } = useLogCopy();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!confirming) {
    return (
      <span className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>{t.list.edit}</Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>{t.list.delete}</Button>
      </span>
    );
  }
  async function remove() {
    setBusy(true);
    await onDelete();
    setBusy(false);
    setConfirming(false);
  }
  return (
    <span className="flex items-center gap-1">
      <span className="text-sm text-ink-muted">{t.list.deleteQ}</span>
      <Button variant="danger" size="sm" isLoading={busy} onClick={() => void remove()}>{t.list.delete}</Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={() => setConfirming(false)}>{t.list.keep}</Button>
    </span>
  );
}

function EntryRow({ entry, who, onEdit, onDelete }: { entry: Entry; who: string; onEdit: () => void; onDelete: () => Promise<void> }) {
  const { locale } = useLogCopy();
  const detail = [shortDate(entry.date, locale), entry.kind === "expense" ? entry.merchant : null, entry.note].filter(Boolean).join(" · ");
  return (
    <li className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium text-ink">
          {categoryLabel(entry.category, locale)} <span className="font-normal text-ink-muted">· {who}</span>
        </span>
        {entry.kind === "expense" ? (
          <Money cents={entry.amountCents} className="shrink-0 text-sm font-semibold text-ink" />
        ) : (
          <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums text-accent-strong">
            {formatDuration(entry.minutes, locale)}
          </span>
        )}
      </div>
      <div className="mt-0.5 flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs text-ink-muted">{detail}</span>
        <RowActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </li>
  );
}

export function EntryList({ api, entries, members, onChanged }: Props) {
  const { t } = useLogCopy();
  const [editing, setEditing] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? t.list.someone;

  async function remove(id: string) {
    try {
      await api.deleteEntry(id);
      setProblem(null);
      await onChanged();
    } catch {
      setProblem(t.list.deleteError);
    }
  }

  if (entries.length === 0) {
    return <EmptyState title={t.list.emptyTitle} description={t.list.emptyHint} />;
  }

  return (
    <Card className="py-2 sm:py-2">
      {problem ? <p className="py-2 text-sm text-danger">{problem}</p> : null}
      <ul className="divide-y divide-line">
        {entries.map((entry) =>
          editing === entry.id ? (
            <li key={entry.id} className="py-3">
              <EditEntry
                api={api}
                entry={entry}
                members={members}
                onDone={(saved) => {
                  setEditing(null);
                  if (saved) void onChanged();
                }}
              />
            </li>
          ) : (
            <EntryRow key={entry.id} entry={entry} who={nameOf(entry.memberId)} onEdit={() => setEditing(entry.id)} onDelete={() => remove(entry.id)} />
          ),
        )}
      </ul>
    </Card>
  );
}
