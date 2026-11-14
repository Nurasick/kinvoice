"use client";
import type { InvoiceTone } from "@/shared/domain";
import { useLocale } from "@/lib/i18n/client";
import { cn } from "@/components/ui";
import { invoiceCopy } from "./copy";

const TONES: readonly InvoiceTone[] = ["warm", "brief", "direct"];

export interface TonePickerProps {
  value: InvoiceTone;
  onChange: (tone: InvoiceTone) => void;
  disabled?: boolean;
}

/** Segmented radio group. Picking a tone asks for a fresh draft in that tone. */
export function TonePicker({ value, onChange, disabled = false }: TonePickerProps) {
  const { locale } = useLocale();
  const t = invoiceCopy(locale).composer;
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2 text-sm font-medium text-ink-soft">{t.tone}</legend>
      <div className="grid grid-cols-3 gap-1 rounded-[var(--radius-control)] border border-line bg-paper p-1">
        {TONES.map((tone) => (
          <label
            key={tone}
            title={t.tones[tone].hint}
            className={cn(
              "cursor-pointer rounded-[calc(var(--radius-control)-2px)] px-3 py-2 text-center text-sm font-medium transition-colors",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
              value === tone ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            <input
              type="radio"
              name="tone"
              value={tone}
              checked={value === tone}
              onChange={() => onChange(tone)}
              className="sr-only"
            />
            {t.tones[tone].label}
          </label>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">{t.tones[value].hint}</p>
    </fieldset>
  );
}
