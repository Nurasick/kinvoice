"use client";
/**
 * Editable entry card — used for AI drafts, the manual form and editing saved entries. Owner: Olzhas.
 */
import type { ReactNode } from "react";
import type { Member } from "@/shared/domain";
import { Badge, Card, Field, Input, Select, cn } from "@/components/ui";
import { categoriesFor, changeKind, type DraftForm, type EntryKind, type FormErrors } from "./draft-form";
import { useLogCopy } from "./copy-context";
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

/** Label with a translated "(optional)" — the shared Field only knows the English word. */
function OptionalLabel({ text }: { text: string }) {
  const { t } = useLogCopy();
  return (
    <>
      {text}
      <span className="ml-1.5 font-normal text-ink-muted">{t.optional}</span>
    </>
  );
}

/**
 * The card is one thing: money spent OR time given. A fixed label says which (cobalt = money,
 * marigold = time), with a small link for the rare case the AI picked the wrong type.
 * A two-option toggle here read as "fill in both", so it was replaced.
 */
function KindLabel({ kind, onSwitch }: { kind: EntryKind; onSwitch: () => void }) {
  const { t } = useLogCopy();
  const isExpense = kind === "expense";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className="flex items-center gap-2 font-display text-base font-medium text-ink">
        <span aria-hidden className={cn("size-2.5 rounded-full", isExpense ? "bg-accent" : "bg-marigold")} />
        <span className="sr-only">{t.card.kind}: </span>
        {isExpense ? t.card.expense : t.card.time}
      </p>
      <button
        type="button"
        onClick={onSwitch}
        className="text-sm text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
      >
        {isExpense ? t.card.toTime : t.card.toExpense}
      </button>
    </div>
  );
}

function ExpenseFields({ form, errors, set }: { form: DraftForm; errors: FormErrors; set: Setter }) {
  const { t } = useLogCopy();
  return (
    <>
      <Field label={t.card.amount} error={errors.amount}>
        {(p) => <Input {...p} inputMode="decimal" placeholder="0.00" className="tabular-nums" value={form.amount} onChange={(e) => set({ amount: e.target.value })} />}
      </Field>
      <Field label={<OptionalLabel text={t.card.where} />}>
        {(p) => <Input {...p} maxLength={80} placeholder={t.card.wherePlaceholder} value={form.merchant} onChange={(e) => set({ merchant: e.target.value })} />}
      </Field>
    </>
  );
}

function DurationFields({ form, errors, set }: { form: DraftForm; errors: FormErrors; set: Setter }) {
  const { t } = useLogCopy();
  return (
    <div className="sm:col-span-2">
      <Field label={t.card.howLong} error={errors.duration} hint={t.card.hoursHint}>
        {(p) => (
          <div className="flex items-center gap-2">
            <Input {...p} inputMode="decimal" placeholder="0" aria-label={t.card.hours} className="tabular-nums" value={form.hours} onChange={(e) => set({ hours: e.target.value })} />
            <span className="text-sm text-ink-muted">{t.card.h}</span>
            <Input inputMode="numeric" placeholder="0" aria-label={t.card.minutes} aria-invalid={p["aria-invalid"]} className="tabular-nums" value={form.mins} onChange={(e) => set({ mins: e.target.value })} />
            <span className="text-sm text-ink-muted">{t.card.min}</span>
          </div>
        )}
      </Field>
    </div>
  );
}

export function EntryCard({ form, members, errors = {}, onChange, actions, badge, flat = false }: Props) {
  const { t, locale } = useLogCopy();
  const set: Setter = (patch) => onChange({ ...form, ...patch });
  const memberOptions = members.map((m) => ({ value: m.id, label: m.role === "caregiver" ? `${m.name} ${t.card.you}` : m.name }));
  const categoryOptions = categoriesFor(form.kind).map((c) => ({ value: c, label: categoryLabel(c, locale) }));
  return (
    <Card tone={flat ? "flat" : "raised"}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <KindLabel kind={form.kind} onSwitch={() => onChange(changeKind(form, form.kind === "expense" ? "time" : "expense"))} />
        {badge ? <Badge tone="accent">{badge}</Badge> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {form.kind === "expense" ? <ExpenseFields form={form} errors={errors} set={set} /> : <DurationFields form={form} errors={errors} set={set} />}
        <Field label={t.card.category} error={errors.category}>
          {(p) => <Select {...p} options={categoryOptions} value={form.category} onChange={(e) => set({ category: e.target.value })} />}
        </Field>
        <Field label={t.card.date} error={errors.date}>
          {(p) => <Input {...p} type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} />}
        </Field>
        <Field label={form.kind === "expense" ? t.card.paidBy : t.card.givenBy} error={errors.memberId}>
          {(p) => <Select {...p} options={memberOptions} value={form.memberId} onChange={(e) => set({ memberId: e.target.value })} />}
        </Field>
        <Field label={<OptionalLabel text={t.card.note} />} error={errors.note}>
          {(p) => <Input {...p} maxLength={280} placeholder={t.card.notePlaceholder} value={form.note} onChange={(e) => set({ note: e.target.value })} />}
        </Field>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">{actions}</div>
    </Card>
  );
}
