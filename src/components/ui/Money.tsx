import { formatCents, formatMinutes } from "@/lib/money";
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
  className?: string;
}

/** Formatted care time ("2h 30m") in tabular numerals. */
export function Duration({ minutes, className }: DurationProps) {
  return <span className={cn("tabular-nums whitespace-nowrap", className)}>{formatMinutes(minutes)}</span>;
}
