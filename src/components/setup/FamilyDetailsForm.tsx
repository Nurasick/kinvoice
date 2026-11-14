"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { Button, Card, Field, Input } from "@/components/ui";
import { DollarInput } from "./DollarInput";
import { PaymentHandlesFields } from "./PaymentHandlesFields";
import {
  draftFromWorkspace,
  isDirty,
  toUpdateRequest,
  type SettingsDraft,
  type SettingsErrors,
} from "./settings-draft";

/** Parent name, hourly value and payment handles. Saves with PATCH /api/workspace. */
export function FamilyDetailsForm() {
  const { api, view, refresh } = useWorkspace();
  const saved = draftFromWorkspace(view.workspace);
  const [draft, setDraft] = useState<SettingsDraft>(saved);
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = isDirty(draft, saved);

  useEffect(() => {
    if (!justSaved) return;
    const t = window.setTimeout(() => setJustSaved(false), 2500);
    return () => window.clearTimeout(t);
  }, [justSaved]);

  function set<K extends keyof SettingsDraft>(key: K, value: SettingsDraft[K]): void {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
    setJustSaved(false);
  }

  async function save(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const result = toUpdateRequest(draft);
    if (!result.ok) return setErrors(result.errors);
    setIsSaving(true);
    try {
      await api.updateWorkspace(result.patch);
      await refresh();
      setJustSaved(true);
    } catch {
      setErrors({ form: "We couldn't save just now. Your changes are still here, so please try again." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <form onSubmit={(e) => void save(e)} noValidate className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-lg font-medium">Family details</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Changes apply to new invoices. Invoices you already sent stay as they were.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
          <Field label="Parent's name" error={errors.parentName}>
            {(p) => (
              <Input
                {...p}
                value={draft.parentName}
                onChange={(e) => set("parentName", e.target.value)}
                maxLength={60}
              />
            )}
          </Field>
          <Field
            label="Value of an hour of care"
            error={errors.hourlyRate}
            hint="Shown with time given. Never split."
          >
            {(p) => <DollarInput {...p} value={draft.hourlyRate} onChange={(v) => set("hourlyRate", v)} />}
          </Field>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-ink-soft">How siblings can pay you</h3>
          <PaymentHandlesFields values={draft} onChange={set} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" isLoading={isSaving} disabled={!dirty}>
            Save changes
          </Button>
          {dirty && !isSaving && (
            <Button variant="ghost" onClick={() => setDraft(saved)}>
              Discard
            </Button>
          )}
          <p aria-live="polite" className={errors.form ? "text-sm text-danger" : "text-sm text-success"}>
            {errors.form ?? (justSaved ? "Saved." : "")}
          </p>
        </div>
      </form>
    </Card>
  );
}
