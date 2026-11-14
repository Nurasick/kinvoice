"use client";
/** This month's saved entries with inline edit and delete. Owner: Olzhas. */
import { useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import type { Entry, Member } from "@/shared/domain";
import { formatCents, formatMinutes } from "@/lib/money";
import { entryToForm, formToNewEntry, type DraftForm, type FormErrors } from "./draft-form";
import { EntryCard } from "./EntryCard";
import { categoryLabel, shortDate } from "./labels";
import { Button, Card } from "./ui";

interface Props {
  api: WorkspaceApi;
  entries: readonly Entry[];
  members: readonly Member[];
  onChanged: () => Promise<void>;
}

function EditEntry({ api, entry, members, onDone }: { api: WorkspaceApi; entry: Entry; members: readonly Member[]; onDone: (saved: boolean) => void }) {
  const [form, setForm] = useState<DraftForm>(() => entryToForm(entry));
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);

  async function save() {
    const result = formToNewEntry(form);
    if (!result.ok) return setErrors(result.errors);
    setBusy(true);
    try {
      await api.updateEntry(entry.id, result.entry);
      onDone(true);
    } catch {
      setErrors({ note: "Couldn't save just now — please try again." });
      setBusy(false);
    }
  }

  return (
    <EntryCard
      form={form}
      members={members}
      errors={errors}
      onChange={setForm}
      actions={
        <>
          <Button variant="ghost" onClick={() => onDone(false)} disabled={busy}>Cancel</Button>
          <Button onClick={() => void save()} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
        </>
      }
    />
  );
}

function EntryRow({ entry, who, onEdit, onDelete }: { entry: Entry; who: string; onEdit: () => void; onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const amount = entry.kind === "expense" ? formatCents(entry.amountCents) : formatMinutes(entry.minutes);
  const detail = [entry.kind === "expense" ? entry.merchant : null, entry.note].filter(Boolean).join(" · ");

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
      <span className="w-24 shrink-0 text-sm text-stone-500">{shortDate(entry.date)}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-stone-900">
          {categoryLabel(entry.category)} <span className="font-normal text-stone-500">· {who}</span>
        </span>
        {detail ? <span className="block truncate text-xs text-stone-500">{detail}</span> : null}
      </span>
      <span className={`text-sm font-semibold tabular-nums ${entry.kind === "time" ? "text-teal-800" : "text-stone-900"}`}>{amount}</span>
      <span className="flex gap-1">
        {confirming ? (
          <>
            <Button variant="danger" className="px-2 py-1" disabled={busy} onClick={async () => { setBusy(true); await onDelete(); setBusy(false); setConfirming(false); }}>
              {busy ? "Deleting…" : "Delete"}
            </Button>
            <Button variant="ghost" className="px-2 py-1" onClick={() => setConfirming(false)}>Keep</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="px-2 py-1" onClick={onEdit}>Edit</Button>
            <Button variant="ghost" className="px-2 py-1" onClick={() => setConfirming(true)}>Delete</Button>
          </>
        )}
      </span>
    </li>
  );
}

export function EntryList({ api, entries, members, onChanged }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "Someone";

  async function remove(id: string) {
    try {
      await api.deleteEntry(id);
      setProblem(null);
      await onChanged();
    } catch {
      setProblem("Couldn't delete that entry just now — please try again.");
    }
  }

  if (entries.length === 0) {
    return <Card className="text-center text-sm text-stone-600">Nothing logged this month yet. Your first note above is all it takes.</Card>;
  }

  return (
    <Card className="py-2">
      {problem ? <p className="py-2 text-sm text-red-700">{problem}</p> : null}
      <ul className="divide-y divide-stone-100">
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
