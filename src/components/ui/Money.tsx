import { formatDuration } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import { formatCents } from "@/lib/money";
import { cn } from "./cn";

export interface MoneyProps {
  cents: number;
  className?: string;
}

/** Formatted USD amount in tabular numerals. The way UI prints money. */
export function Money({ cents, className }: MoneyProps) {
  return <span className={cn("tabular-nums whitespace-nowrap", className)}>{formatCents(cents)}</span>;
}

export interface DurationProps {
  minutes: number;
  /** Units follow the reader's language ("2h 30m", "2 ч 30 мин", "2 сағ 30 мин"). Default English. */
  locale?: Locale;
  className?: string;
}

/** Formatted care time in tabular numerals. */
export function Duration({ minutes, locale = "en", className }: DurationProps) {
  return (
    <span className={cn("tabular-nums whitespace-nowrap", className)}>{formatDuration(minutes, locale)}</span>
  );
}
