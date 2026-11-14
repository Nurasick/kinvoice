"use client";
import { useState, type FormEvent, type ReactNode } from "react";
import { publicApi } from "@/lib/api/client";
import { saveWorkspaceKey } from "@/lib/workspace-key";
import { Button, Card, Field, Input } from "@/components/ui";
import { emptyDraft, toCreateRequest, type SetupDraft, type SetupErrors } from "./setup-draft";
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
      setErrors({
        form: "We couldn't save your family just now. Your details are still here, so please try again.",
      });
      setIsSaving(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={(e) => void submit(e)} noValidate className="flex flex-col gap-6">
      <Section title="Who you're caring for" description="First names are enough.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Parent's name" error={errors.parentName}>
            {(p) => (
              <Input
                {...p}
                value={draft.parentName}
                onChange={(e) => set("parentName", e.target.value)}
                placeholder="Mom, or Linda"
                maxLength={60}
              />
            )}
          </Field>
          <Field label="Your name" error={errors.caregiverName}>
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

      <Section
        title="Your siblings"
        description="They'll get a link. They never need an account. Emails are just for your reference."
      >
        <SiblingsFields siblings={draft.siblings} errors={errors} onChange={(s) => set("siblings", s)} />
      </Section>

      <Section
        title="Value of your time"
        description="Shown next to the money so the time you give is seen. It's never added to anyone's suggested contribution."
      >
        <div className="max-w-48">
          <Field label="Per hour of care" error={errors.hourlyRate}>
            {(p) => <DollarInput {...p} value={draft.hourlyRate} onChange={(v) => set("hourlyRate", v)} />}
          </Field>
        </div>
      </Section>

      <Section
        title="How siblings can pay you"
        description="Optional. Pay buttons only show for the ones you fill in."
      >
        <PaymentHandlesFields values={draft} onChange={set} />
      </Section>

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role={hasErrors ? "alert" : undefined} className="text-sm text-danger">
          {errors.form ?? (hasErrors ? "A few details need a look above." : "")}
        </p>
        <Button type="submit" size="lg" isLoading={isSaving}>
          Create our family space
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

interface DollarInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

function DollarInput({ value, onChange, ...aria }: DollarInputProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-ink-muted"
      >
        $
      </span>
      <Input
        {...aria}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-12 pl-7 tabular-nums"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink-muted"
      >
        /hr
      </span>
    </div>
  );
}
