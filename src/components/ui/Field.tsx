"use client";
import { useId, type ReactNode } from "react";

export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  /** Text after the label when optional. Default English "(optional)". */
  optionalLabel?: string;
  /** Render prop so the control gets the right id and aria wiring. */
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Label + control + hint/error, accessibly wired.
 * `<Field label="Parent name">{(p) => <Input {...p} value={name} />}</Field>`
 */
export function Field({
  label,
  hint,
  error,
  optional = false,
  optionalLabel = "(optional)",
  children,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const describedBy = error || hint ? hintId : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-muted">{optionalLabel}</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <p id={hintId} className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
