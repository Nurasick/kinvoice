/**
 * Editable card state ↔ domain types. Owner: Olzhas.
 * Inputs are strings; conversion to integer cents/minutes happens here, at the UI edge.
 */
import {
  ExpenseCategory,
  NewEntry,
  TimeCategory,
  type DraftEntry,
  type Entry,
  type EntrySource,
} from "@/shared/domain";
import { parseDollarsToCents } from "@/lib/money";
import { logCopy, type ErrorCopy } from "./copy";

export type EntryKind = "expense" | "time";

export interface DraftForm {
  /** Stable React key. */
  key: string;
  kind: EntryKind;
  date: string;
  memberId: string;
  /** Dollars as typed, e.g. "86" or "12.50". */
  amount: string;
  hours: string;
  mins: string;
  category: string;
  merchant: string;
  note: string;
  source: EntrySource;
}

export type FormErrors = Partial<Record<"date" | "memberId" | "amount" | "duration" | "category" | "note", string>>;

export type FormResult = { ok: true; entry: NewEntry } | { ok: false; errors: FormErrors };

let counter = 0;
export function newFormKey(): string {
  counter += 1;
  return `draft-${Date.now().toString(36)}-${counter}`;
}

/** Caregiver's local calendar day, YYYY-MM-DD. */
export function localToday(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function categoriesFor(kind: EntryKind): readonly string[] {
  return kind === "expense" ? ExpenseCategory.options : TimeCategory.options;
}

function centsToDollars(cents: number | undefined): string {
  if (cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(/\.00$/, "");
}

function splitMinutes(minutes: number | undefined): { hours: string; mins: string } {
  if (minutes === undefined) return { hours: "", mins: "" };
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return { hours: h ? String(h) : "", mins: m ? String(m) : "" };
}

export interface FormDefaults {
  today: string;
  caregiverId: string;
  source: EntrySource;
}

export function draftToForm(draft: DraftEntry, d: FormDefaults): DraftForm {
  const category = draft.category && categoriesFor(draft.kind).includes(draft.category) ? draft.category : "other";
  return {
    key: newFormKey(),
    kind: draft.kind,
    date: draft.date ?? d.today,
    memberId: draft.memberId ?? d.caregiverId,
    amount: centsToDollars(draft.amountCents),
    ...splitMinutes(draft.minutes),
    category,
    merchant: draft.merchant ?? "",
    note: draft.note ?? "",
    source: d.source,
  };
}

export function emptyForm(kind: EntryKind, d: FormDefaults): DraftForm {
  return draftToForm({ kind }, d);
}

export function entryToForm(entry: Entry): DraftForm {
  return {
    ...draftToForm(entry, { today: entry.date, caregiverId: entry.memberId, source: entry.source }),
    key: entry.id,
  };
}

/** Switching kind keeps shared fields and resets a category that doesn't fit. */
export function changeKind(form: DraftForm, kind: EntryKind): DraftForm {
  const category = categoriesFor(kind).includes(form.category) ? form.category : "other";
  return { ...form, kind, category };
}

/** Hours may be decimal ("1.5"); minutes are whole. Returns null if not a positive duration. */
export function parseDuration(hours: string, mins: string): number | null {
  const h = hours.trim() === "" ? 0 : Number(hours);
  const m = mins.trim() === "" ? 0 : Number(mins);
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || m < 0 || !Number.isInteger(m)) return null;
  const total = Math.round(h * 60) + m;
  return total > 0 && total <= 24 * 60 ? total : null;
}

function validate(form: DraftForm, msg: ErrorCopy): FormErrors {
  const errors: FormErrors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) errors.date = msg.date;
  if (!form.memberId) errors.memberId = msg.memberId;
  if (!categoriesFor(form.kind).includes(form.category)) errors.category = msg.category;
  if (form.note.trim().length > 280) errors.note = msg.note;
  if (form.kind === "expense") {
    const cents = parseDollarsToCents(form.amount);
    if (cents === null || cents <= 0) errors.amount = msg.amount;
  } else if (parseDuration(form.hours, form.mins) === null) {
    errors.duration = msg.duration;
  }
  return errors;
}

/** Validates and converts a card. Error messages come from the screen's dictionary (English by default). */
export function formToNewEntry(form: DraftForm, msg: ErrorCopy = logCopy("en").errors): FormResult {
  const errors = validate(form, msg);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const base = { date: form.date, memberId: form.memberId, note: form.note.trim(), source: form.source };
  const candidate =
    form.kind === "expense"
      ? { ...base, kind: "expense" as const, amountCents: parseDollarsToCents(form.amount), category: form.category, merchant: form.merchant.trim() || undefined }
      : { ...base, kind: "time" as const, minutes: parseDuration(form.hours, form.mins), category: form.category };
  const parsed = NewEntry.safeParse(candidate);
  return parsed.success ? { ok: true, entry: parsed.data } : { ok: false, errors: { note: msg.generic } };
}
