"use client";
import type { Locale } from "@/lib/i18n/locales";
import { Button } from "./Button";

const ARROWS: Record<Locale, { prev: string; next: string }> = {
  en: { prev: "Previous month", next: "Next month" },
  ru: { prev: "Предыдущий месяц", next: "Следующий месяц" },
  kk: { prev: "Алдыңғы ай", next: "Келесі ай" },
};

export interface MonthPickerProps {
  /** "YYYY-MM" */
  month: string;
  onChange: (month: string) => void;
  /** Latest selectable month, "YYYY-MM" (usually the current month). */
  max?: string;
  /** Button labels follow the reader's language. Default English. */
  locale?: Locale;
  /**
   * Visible month text, e.g. monthLabel(month, locale) from components/log/labels.
   * Pass it for RU/KZ: browsers ship no Kazakh month names, so Intl alone prints "M11".
   */
  label?: string;
}

function shift(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function englishLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** ‹ November 2026 › — previous/next month, capped at `max`. */
export function MonthPicker({ month, onChange, max, locale = "en", label }: MonthPickerProps) {
  const atMax = max !== undefined && month >= max;
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        aria-label={ARROWS[locale].prev}
        onClick={() => onChange(shift(month, -1))}
      >
        <Chevron dir="left" />
      </Button>
      <span aria-live="polite" className="min-w-34 text-center text-sm font-medium text-ink tabular-nums">
        {label ?? englishLabel(month)}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        aria-label={ARROWS[locale].next}
        disabled={atMax}
        onClick={() => onChange(shift(month, 1))}
      >
        <Chevron dir="right" />
      </Button>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-4">
      <path
        d={dir === "left" ? "M12.5 5 7.5 10l5 5" : "M7.5 5l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
