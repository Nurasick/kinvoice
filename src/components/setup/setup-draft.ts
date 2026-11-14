/**
 * Setup form state → CreateWorkspaceRequest. Pure, so it's unit-tested.
 * Error keys: "parentName" | "caregiverName" | "siblings" | "hourlyRate" | "sibling.<i>.name" | "sibling.<i>.email" | "handles".
 */
import { CreateWorkspaceRequest } from "@/shared/api";
import { parseDollarsToCents } from "@/lib/money";

export interface SiblingDraft {
  name: string;
  email: string;
}

export interface SetupDraft {
  parentName: string;
  caregiverName: string;
  siblings: SiblingDraft[];
  /** Dollars as typed, e.g. "25" or "27.50". */
  hourlyRate: string;
  venmo: string;
  paypal: string;
  zelle: string;
}

export type SetupErrors = Record<string, string>;

export type SetupResult = { ok: true; request: CreateWorkspaceRequest } | { ok: false; errors: SetupErrors };

export const MAX_SIBLINGS = 8;
export const DEFAULT_HOURLY_RATE = "25";

export function emptyDraft(): SetupDraft {
  return {
    parentName: "",
    caregiverName: "",
    siblings: [{ name: "", email: "" }],
    hourlyRate: DEFAULT_HOURLY_RATE,
    venmo: "",
    paypal: "",
    zelle: "",
  };
}

function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function siblingErrors(siblings: readonly SiblingDraft[]): SetupErrors {
  const errors: SetupErrors = {};
  siblings.forEach((s, i) => {
    const email = s.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors[`sibling.${i}.email`] = "That email doesn't look right.";
    if (!s.name.trim() && email) errors[`sibling.${i}.name`] = "Add a name for this sibling.";
  });
  return errors;
}

function fieldErrors(draft: SetupDraft, named: readonly SiblingDraft[]): SetupErrors {
  const errors: SetupErrors = { ...siblingErrors(draft.siblings) };
  if (!draft.parentName.trim()) errors.parentName = "Who are you caring for? A first name is enough.";
  if (!draft.caregiverName.trim()) errors.caregiverName = "Add your name so siblings know who sent it.";
  if (named.length === 0) errors.siblings = "Add at least one sibling to share the invoice with.";
  const rate = parseDollarsToCents(draft.hourlyRate);
  if (rate === null || rate > 100_00) errors.hourlyRate = "Use an amount between $0 and $100 per hour.";
  return errors;
}

export function toCreateRequest(draft: SetupDraft): SetupResult {
  const named = draft.siblings.filter((s) => s.name.trim() !== "");
  const errors = fieldErrors(draft, named);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const parsed = CreateWorkspaceRequest.safeParse({
    parentName: draft.parentName,
    caregiverName: draft.caregiverName,
    siblings: named.map((s) => ({ name: s.name, email: optional(s.email) })),
    hourlyRateCents: parseDollarsToCents(draft.hourlyRate),
    caregiverHandles: {
      venmo: optional(draft.venmo)?.replace(/^@/, ""),
      paypal: optional(draft.paypal),
      zelle: optional(draft.zelle),
    },
  });
  if (!parsed.success)
    return { ok: false, errors: { form: "Some details are too long. Please shorten them." } };
  return { ok: true, request: parsed.data };
}
