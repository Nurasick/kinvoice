"use client";
import { useState, type FormEvent, type ReactNode } from "react";
import { publicApi } from "@/lib/api/client";
import { saveWorkspaceKey } from "@/lib/workspace-key";
import { useLocale } from "@/lib/i18n/client";
import { Button, Card, Field, Input } from "@/components/ui";
import { setupCopy } from "./copy";
import { emptyDraft, toCreateRequest, type SetupDraft, type SetupErrors } from "./setup-draft";
import { DollarInput } from "./DollarInput";
import { PaymentHandlesFields } from "./PaymentHandlesFields";
import { SiblingsFields } from "./SiblingsFields";

export interface SetupFormProps {
  /** Called with the new edit key once the workspace exists (already saved on this device). */
  onCreated: (editKey: string) => void;
}

export function SetupForm({ onCreated }: SetupFormProps) {
  const [draft, setDraft] = useState<SetupDraft>(emptyDraft);
  const [errors, setErrors] = useState<SetupErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const { locale } = useLocale();
  const c = setupCopy(locale);
  const t = c.setup;

  function set<K extends keyof SetupDraft>(key: K, value: SetupDraft[K]): void {
    setDraft((d) => ({ ...d, [key]: value }));
    // Editing a field clears its message (siblings share one group of messages).
    setErrors((errs) => clearErrorsFor(errs, key));
  }

  async function submit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const result = toCreateRequest(draft);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstInvalid(e.currentTarget);
      return;
    }
    setErrors({});
    setIsSaving(true);
    try {
      const { editKey } = await publicApi.createWorkspace(result.request);
      saveWorkspaceKey(editKey);
      onCreated(editKey);
    } catch {
      setErrors({ form: "setupFailed" });
      setIsSaving(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={(e) => void submit(e)} noValidate className="flex flex-col gap-6">
      <Section title={t.whoTitle} description={t.whoBody}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={c.fields.parentName} error={errors.parentName && c.errors[errors.parentName]}>
            {(p) => (
              <Input
                {...p}
                value={draft.parentName}
                onChange={(e) => set("parentName", e.target.value)}
                placeholder={t.parentPlaceholder}
                maxLength={60}
              />
            )}
          </Field>
          <Field label={t.yourName} error={errors.caregiverName && c.errors[errors.caregiverName]}>
            {(p) => (
              <Input
                {...p}
                value={draft.caregiverName}
                onChange={(e) => set("caregiverName", e.target.value)}
                placeholder="Sarah"
                autoComplete="given-name"
                maxLength={60}
              />
            )}
          </Field>
        </div>
      </Section>

      <Section title={t.siblingsTitle} description={t.siblingsBody}>
        <SiblingsFields siblings={draft.siblings} errors={errors} onChange={(s) => set("siblings", s)} />
      </Section>

      <Section title={t.timeTitle} description={t.timeBody}>
        <div className="max-w-48">
          <Field label={c.settings.rateLabel} error={errors.hourlyRate && c.errors[errors.hourlyRate]}>
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
      </Section>

      <Section title={t.payTitle} description={t.payBody}>
        <PaymentHandlesFields values={draft} onChange={set} />
      </Section>

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role={hasErrors ? "alert" : undefined} className="text-sm text-danger">
          {errors.form ? c.errors[errors.form] : hasErrors ? t.needsLook : ""}
        </p>
        <Button type="submit" size="lg" isLoading={isSaving}>
          {t.submit}
        </Button>
      </div>
    </form>
  );
}

function clearErrorsFor(errors: SetupErrors, key: keyof SetupDraft): SetupErrors {
  const prefix = key === "siblings" ? "sibling" : key;
  const next = Object.fromEntries(
    Object.entries(errors).filter(([k]) => !k.startsWith(prefix) && k !== "form"),
  );
  return Object.keys(next).length === Object.keys(errors).length ? errors : next;
}

/** Waits for React to render the messages, then moves focus to the first invalid control. */
function focusFirstInvalid(form: HTMLFormElement): void {
  requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <h2 className="font-display text-lg font-medium">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-ink-muted">{description}</p>
      {children}
    </Card>
  );
}
