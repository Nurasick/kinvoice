/**
 * Turns untrusted model JSON into valid DraftEntry objects. Owner: Olzhas.
 *
 * Field-by-field: a bad field is dropped, not the whole draft, so the caregiver
 * still gets a prefilled card. Never throws.
 */
import { DraftEntry, ExpenseCategory, IsoDate, TimeCategory } from "@/shared/domain";

export interface SalvageResult {
  drafts: DraftEntry[];
  /** true when anything had to be dropped or repaired. */
  lossy: boolean;
}

type Kind = DraftEntry["kind"];

const MAX_CENTS = 10_000_000; // $100,000 — anything above is a parsing mistake
const MAX_MINUTES = 24 * 60;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isRealDate(v: unknown): v is string {
  if (!IsoDate.safeParse(v).success) return false;
  const d = new Date(`${v as string}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function intInRange(v: unknown, min: number, max: number): number | undefined {
  return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : undefined;
}

function text(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

function categoryFor(kind: Kind, v: unknown): DraftEntry["category"] {
  const schema = kind === "expense" ? ExpenseCategory : TimeCategory;
  const parsed = schema.safeParse(v);
  return parsed.success ? parsed.data : undefined;
}

/** Copies only the fields that are valid for this kind. Returns null if `raw` is not a draft at all. */
export function salvageDraft(raw: unknown, memberIds: readonly string[], forceKind?: Kind): DraftEntry | null {
  if (!isRecord(raw)) return null;
  const kind = forceKind ?? (raw.kind === "expense" || raw.kind === "time" ? raw.kind : null);
  if (!kind) return null;

  const candidate: DraftEntry = {
    kind,
    date: isRealDate(raw.date) ? raw.date : undefined,
    memberId: typeof raw.memberId === "string" && memberIds.includes(raw.memberId) ? raw.memberId : undefined,
    amountCents: kind === "expense" ? intInRange(raw.amountCents, 1, MAX_CENTS) : undefined,
    minutes: kind === "time" ? intInRange(raw.minutes, 1, MAX_MINUTES) : undefined,
    category: categoryFor(kind, raw.category),
    merchant: kind === "expense" ? text(raw.merchant, 80) : undefined,
    note: text(raw.note, 280),
  };
  const clean = Object.fromEntries(Object.entries(candidate).filter(([, v]) => v !== undefined));
  const parsed = DraftEntry.safeParse(clean);
  return parsed.success ? parsed.data : null;
}

/** Did salvaging lose information the model actually sent? (null counts as "not sent".) */
function lostFields(raw: unknown, draft: DraftEntry): boolean {
  if (!isRecord(raw)) return true;
  const sent = Object.entries(raw).filter(([k, v]) => v !== null && v !== "" && k !== "kind");
  const relevant = sent.filter(([k]) => !(draft.kind === "time" && (k === "amountCents" || k === "merchant")));
  return relevant.some(([k]) => !(k in draft)) || (raw.kind !== undefined && raw.kind !== draft.kind);
}

/** Salvages `{ drafts: [...] }` from the quick-log model output. */
export function salvageDrafts(raw: unknown, memberIds: readonly string[]): SalvageResult {
  const list = isRecord(raw) && Array.isArray(raw.drafts) ? raw.drafts : null;
  if (!list) return { drafts: [], lossy: true };
  const drafts: DraftEntry[] = [];
  let lossy = false;
  for (const item of list.slice(0, 20)) {
    const draft = salvageDraft(item, memberIds);
    if (!draft) {
      lossy = true;
      continue;
    }
    if (lostFields(item, draft)) lossy = true;
    drafts.push(draft);
  }
  return { drafts, lossy: lossy || list.length > 20 };
}

/** Parses model text as JSON without throwing. */
export function parseJsonSafe(textOut: string | null | undefined): unknown {
  if (!textOut) return null;
  try {
    return JSON.parse(textOut) as unknown;
  } catch {
    return null;
  }
}
