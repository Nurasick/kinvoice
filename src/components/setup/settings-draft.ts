/**
 * Settings form state ↔ UpdateWorkspaceRequest. Pure, so it's unit-tested.
 * Only fields the API can change: parent name, hourly value, payment handles.
 */
import { UpdateWorkspaceRequest } from "@/shared/api";
import type { Workspace } from "@/shared/domain";
import { parseDollarsToCents } from "@/lib/money";

export interface SettingsDraft {
  parentName: string;
  /** Dollars as typed, e.g. "25" or "27.50". */
  hourlyRate: string;
  venmo: string;
  paypal: string;
  zelle: string;
}

export type SettingsErrors = Partial<Record<"parentName" | "hourlyRate" | "form", string>>;

export type SettingsResult =
  { ok: true; patch: UpdateWorkspaceRequest } | { ok: false; errors: SettingsErrors };

export function draftFromWorkspace(w: Workspace): SettingsDraft {
  return {
    parentName: w.parentName,
    hourlyRate: (w.hourlyRateCents / 100).toFixed(2).replace(/\.00$/, ""),
    venmo: w.caregiverHandles.venmo ?? "",
    paypal: w.caregiverHandles.paypal ?? "",
    zelle: w.caregiverHandles.zelle ?? "",
  };
}

function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function toUpdateRequest(draft: SettingsDraft): SettingsResult {
  const errors: SettingsErrors = {};
  if (!draft.parentName.trim()) errors.parentName = "Add a name, even just “Mom”.";
  const rate = parseDollarsToCents(draft.hourlyRate);
  if (rate === null || rate > 100_00) errors.hourlyRate = "Use an amount between $0 and $100 per hour.";
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const parsed = UpdateWorkspaceRequest.safeParse({
    parentName: draft.parentName,
    hourlyRateCents: rate,
    // Empty handles are sent as absent, which removes that pay button.
    caregiverHandles: {
      venmo: optional(draft.venmo)?.replace(/^@/, ""),
      paypal: optional(draft.paypal),
      zelle: optional(draft.zelle),
    },
  });
  if (!parsed.success)
    return { ok: false, errors: { form: "Some details are too long. Please shorten them." } };
  return { ok: true, patch: parsed.data };
}

export function isDirty(draft: SettingsDraft, saved: SettingsDraft): boolean {
  return (Object.keys(draft) as Array<keyof SettingsDraft>).some((k) => draft[k].trim() !== saved[k].trim());
}

/** Delete is confirmed by typing the parent's name (case and spacing forgiven). */
export function confirmsDelete(typed: string, parentName: string): boolean {
  const norm = (s: string): string => s.trim().replace(/\s+/g, " ").toLowerCase();
  return norm(typed) !== "" && norm(typed) === norm(parentName);
}
