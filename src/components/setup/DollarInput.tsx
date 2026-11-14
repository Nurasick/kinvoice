"use client";
import { Input } from "@/components/ui";

export interface DollarInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

/** "$ 25 /hr" input for the hourly value of care time. */
export function DollarInput({ value, onChange, ...aria }: DollarInputProps) {
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
