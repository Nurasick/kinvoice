"use client";
/**
 * Editable entry card — used for AI drafts, the manual form and editing saved entries. Owner: Olzhas.
 */
import type { ReactNode } from "react";
import type { Member } from "@/shared/domain";
import { Badge, Card, Field, Input, Select, cn } from "@/components/ui";
import { categoriesFor, changeKind, type DraftForm, type EntryKind, type FormErrors } from "./draft-form";
import { categoryLabel } from "./labels";

interface Props {
  form: DraftForm;
  members: readonly Member[];
  errors?: FormErrors;
  onChange: (next: DraftForm) => void;
  /** Buttons rendered in the card footer. */
  actions: ReactNode;
  badge?: string;
  /** Nested inside another card (editing in the entries list). */
  flat?: boolean;
}

type Setter = (patch: Partial<DraftForm>) => void;

function KindToggle({ kind, onPick }: { kind: EntryKind; onPick: (k: EntryKind) => void }) {
  const option = (value: EntryKind, label: string) => (
    <button
      type="button"
      aria-pressed={kind === value}
      onClick={() => onPick(value)}
      className={cn(
        "rounded-[calc(var(--radius-control)-2px)] px-3 py-1 text-sm font-medium transition-colors",
        kind === value ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
      )}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-[var(--radius-control)] bg-paper-deep p-1" role="group" aria-label="Entry type">
      {option("expense", "Money spent")}
      {option("time", "Time given")}
    </div>
  );
}

function ExpenseFields({ form, errors, set }: { form: DraftForm; errors: FormErrors; set: Setter }) {
  return (
    <>
      <Field label="Amount ($)" error={errors.amount}>
        {(p) => <Input {...p} inputMode="decimal" placeholder="0.00" className="tabular-nums" value={form.amount} onChange={(e) => set({ amount: e.target.value })} />}
      </Field>
      <Field label="Where" optional>
        {(p) => <Input {...p} maxLength={80} placeholder="e.g. CVS" value={form.merchant} onChange={(e) => set({ merchant: e.target.value })} />}
      </Field>
    </>
  );
}

function DurationFields({ form, errors, set }: { form: DraftForm; errors: FormErrors; set: Setter }) {
  return (
    <div className="sm:col-span-2">
      <Field label="How long" error={errors.duration} hint="Hours can be decimal, e.g. 1.5">
        {(p) => (
          <div className="flex items-center gap-2">
            <Input {...p} inputMode="decimal" placeholder="0" aria-label="Hours" className="tabular-nums" value={form.hours} onChange={(e) => set({ hours: e.target.value })} />
            <span className="text-sm text-ink-muted">h</span>
            <Input inputMode="numeric" placeholder="0" aria-label="Minutes" aria-invalid={p["aria-invalid"]} className="tabular-nums" value={form.mins} onChange={(e) => set({ mins: e.target.value })} />
            <span className="text-sm text-ink-muted">min</span>
          </div>
        )}
      </Field>
    </div>
  );
}

export function EntryCard({ form, members, errors = {}, onChange, actions, badge, flat = false }: Props) {
  const set: Setter = (patch) => onChange({ ...form, ...patch });
  const memberOptions = members.map((m) => ({ value: m.id, label: m.role === "caregiver" ? `${m.name} (you)` : m.name }));
  const categoryOptions = categoriesFor(form.kind).map((c) => ({ value: c, label: categoryLabel(c) }));
  return (
    <Card tone={flat ? "flat" : "raised"}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <KindToggle kind={form.kind} onPick={(k) => onChange(changeKind(form, k))} />
        {badge ? <Badge tone="accent">{badge}</Badge> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {form.kind === "expense" ? <ExpenseFields form={form} errors={errors} set={set} /> : <DurationFields form={form} errors={errors} set={set} />}
        <Field label="Category" error={errors.category}>
          {(p) => <Select {...p} options={categoryOptions} value={form.category} onChange={(e) => set({ category: e.target.value })} />}
        </Field>
        <Field label="Date" error={errors.date}>
          {(p) => <Input {...p} type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} />}
        </Field>
        <Field label={form.kind === "expense" ? "Paid by" : "Given by"} error={errors.memberId}>
          {(p) => <Select {...p} options={memberOptions} value={form.memberId} onChange={(e) => set({ memberId: e.target.value })} />}
        </Field>
        <Field label="Note" optional error={errors.note}>
          {(p) => <Input {...p} maxLength={280} placeholder="Short note — no medical records" value={form.note} onChange={(e) => set({ note: e.target.value })} />}
        </Field>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">{actions}</div>
    </Card>
  );
}
