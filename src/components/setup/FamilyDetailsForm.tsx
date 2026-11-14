"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { useLocale } from "@/lib/i18n/client";
import { Button, Card, Field, Input } from "@/components/ui";
import { setupCopy } from "./copy";
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
  const { locale } = useLocale();
  const c = setupCopy(locale);
  const t = c.settings;
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
      setErrors({ form: "saveFailed" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <form onSubmit={(e) => void save(e)} noValidate className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-lg font-medium">{t.detailsTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t.detailsBody}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
          <Field label={c.fields.parentName} error={errors.parentName && c.errors[errors.parentName]}>
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
            label={t.rateLabel}
            error={errors.hourlyRate && c.errors[errors.hourlyRate]}
            hint={t.rateHint}
          >
            {(p) => (
              <DollarInput
                {...p}
                suffix={c.fields.perHour}
                value={draft.hourlyRate}
                onChange={(v) => set("hourlyRate", v)}
              />
            )}
          </Field>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-ink-soft">{t.payTitle}</h3>
          <PaymentHandlesFields values={draft} onChange={set} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" isLoading={isSaving} disabled={!dirty}>
            {t.save}
          </Button>
          {dirty && !isSaving && (
            <Button variant="ghost" onClick={() => setDraft(saved)}>
              {t.discard}
            </Button>
          )}
          <p aria-live="polite" className={errors.form ? "text-sm text-danger" : "text-sm text-success"}>
            {errors.form ? c.errors[errors.form] : justSaved ? t.saved : ""}
          </p>
        </div>
      </form>
    </Card>
  );
}
