"use client";
import type { InvoiceTone } from "@/shared/domain";
import { cn } from "@/components/ui";

const TONES: ReadonlyArray<{ value: InvoiceTone; label: string; hint: string }> = [
  { value: "warm", label: "Warm", hint: "Personal and appreciative" },
  { value: "brief", label: "Brief", hint: "A few friendly lines" },
  { value: "direct", label: "Direct", hint: "Numbers first, clear ask" },
];

export interface TonePickerProps {
  value: InvoiceTone;
  onChange: (tone: InvoiceTone) => void;
  disabled?: boolean;
}

/** Segmented radio group. Picking a tone asks for a fresh draft in that tone. */
export function TonePicker({ value, onChange, disabled = false }: TonePickerProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2 text-sm font-medium text-ink-soft">Tone</legend>
      <div className="grid grid-cols-3 gap-1 rounded-[var(--radius-control)] border border-line bg-paper p-1">
        {TONES.map((t) => (
          <label
            key={t.value}
            title={t.hint}
            className={cn(
              "cursor-pointer rounded-[calc(var(--radius-control)-2px)] px-3 py-2 text-center text-sm font-medium transition-colors",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
              value === t.value ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            <input
              type="radio"
              name="tone"
              value={t.value}
              checked={value === t.value}
              onChange={() => onChange(t.value)}
              className="sr-only"
            />
            {t.label}
          </label>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">{TONES.find((t) => t.value === value)?.hint}</p>
    </fieldset>
  );
}
