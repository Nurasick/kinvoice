"use client";
/**
 * Editable entry card — used for AI drafts, the manual form and editing saved entries. Owner: Olzhas.
 */
import type { ReactNode } from "react";
import type { Member } from "@/shared/domain";
import { categoriesFor, changeKind, type DraftForm, type EntryKind, type FormErrors } from "./draft-form";
import { categoryLabel } from "./labels";
import { Card, Field, inputClass } from "./ui";

interface Props {
  form: DraftForm;
  members: readonly Member[];
  errors?: FormErrors;
  onChange: (next: DraftForm) => void;
  /** Buttons rendered in the card footer. */
  actions: ReactNode;
  badge?: string;
}

function KindToggle({ kind, onPick }: { kind: EntryKind; onPick: (k: EntryKind) => void }) {
  const option = (value: EntryKind, label: string) => (
    <button
      type="button"
      aria-pressed={kind === value}
      onClick={() => onPick(value)}
      className={`rounded-md px-3 py-1 text-sm font-medium ${kind === value ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"}`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-lg bg-stone-100 p-1" role="group" aria-label="Entry type">
      {option("expense", "Money spent")}
      {option("time", "Time given")}
    </div>
  );
}

function AmountFields({ form, errors, set }: { form: DraftForm; errors: FormErrors; set: (p: Partial<DraftForm>) => void }) {
  if (form.kind === "expense") {
    return (
      <>
        <Field label="Amount ($)" error={errors.amount}>
          <input className={inputClass} inputMode="decimal" placeholder="0.00" value={form.amount} aria-invalid={!!errors.amount} onChange={(e) => set({ amount: e.target.value })} />
        </Field>
        <Field label="Where (optional)">
          <input className={inputClass} maxLength={80} placeholder="e.g. CVS" value={form.merchant} onChange={(e) => set({ merchant: e.target.value })} />
        </Field>
      </>
    );
  }
  return (
    <Field label="How long" error={errors.duration} className="sm:col-span-2">
      <div className="flex items-center gap-2">
        <input className={inputClass} inputMode="decimal" placeholder="0" aria-label="Hours" value={form.hours} aria-invalid={!!errors.duration} onChange={(e) => set({ hours: e.target.value })} />
        <span className="text-stone-500">h</span>
        <input className={inputClass} inputMode="numeric" placeholder="0" aria-label="Minutes" value={form.mins} aria-invalid={!!errors.duration} onChange={(e) => set({ mins: e.target.value })} />
        <span className="text-stone-500">min</span>
      </div>
    </Field>
  );
}

export function EntryCard({ form, members, errors = {}, onChange, actions, badge }: Props) {
  const set = (patch: Partial<DraftForm>) => onChange({ ...form, ...patch });
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <KindToggle kind={form.kind} onPick={(k) => onChange(changeKind(form, k))} />
        {badge ? <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">{badge}</span> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AmountFields form={form} errors={errors} set={set} />
        <Field label="Category" error={errors.category}>
          <select className={inputClass} value={form.category} onChange={(e) => set({ category: e.target.value })}>
            {categoriesFor(form.kind).map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" error={errors.date}>
          <input type="date" className={inputClass} value={form.date} aria-invalid={!!errors.date} onChange={(e) => set({ date: e.target.value })} />
        </Field>
        <Field label={form.kind === "expense" ? "Paid by" : "Given by"} error={errors.memberId}>
          <select className={inputClass} value={form.memberId} onChange={(e) => set({ memberId: e.target.value })}>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}{m.role === "caregiver" ? " (you)" : ""}</option>
            ))}
          </select>
        </Field>
        <Field label="Note (optional)" error={errors.note} className="sm:col-span-2">
          <input className={inputClass} maxLength={280} placeholder="Short note — no medical records" value={form.note} onChange={(e) => set({ note: e.target.value })} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">{actions}</div>
    </Card>
  );
}
