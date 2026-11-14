/**
 * Setup form state → CreateWorkspaceRequest. Pure, so it's unit-tested.
 * Error keys: "parentName" | "caregiverName" | "siblings" | "hourlyRate" | "sibling.<i>.name" | "sibling.<i>.email" | "handles".
 */
import { CreateWorkspaceRequest } from "@/shared/api";
import { parseDollarsToCents } from "@/lib/money";
import type { FormErrorCode } from "./copy";

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

/** Error code per field key; the form words them in the reader's language (copy.ts). */
export type SetupErrors = Record<string, FormErrorCode>;

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
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors[`sibling.${i}.email`] = "emailInvalid";
    if (!s.name.trim() && email) errors[`sibling.${i}.name`] = "siblingNameMissing";
  });
  return errors;
}

function fieldErrors(draft: SetupDraft, named: readonly SiblingDraft[]): SetupErrors {
  const errors: SetupErrors = { ...siblingErrors(draft.siblings) };
  if (!draft.parentName.trim()) errors.parentName = "parentMissing";
  if (!draft.caregiverName.trim()) errors.caregiverName = "caregiverMissing";
  if (named.length === 0) errors.siblings = "noSiblings";
  const rate = parseDollarsToCents(draft.hourlyRate);
  if (rate === null || rate > 100_00) errors.hourlyRate = "rateRange";
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
  if (!parsed.success) return { ok: false, errors: { form: "tooLong" } };
  return { ok: true, request: parsed.data };
}
