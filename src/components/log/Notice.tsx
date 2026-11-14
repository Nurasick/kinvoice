/** Inline status message for the Log page. Owner: Olzhas. (Not in ui/ yet — tell Yernur if it should be.) */
import type { ReactNode } from "react";
import { cn } from "@/components/ui";

export type NoticeTone = "info" | "success" | "warn";

const TONES: Record<NoticeTone, string> = {
  info: "border-line bg-paper-deep text-ink-soft",
  success: "border-success/25 bg-success-soft text-success",
  warn: "border-warning/25 bg-warning-soft text-warning",
};

export function Notice({ tone = "info", children }: { tone?: NoticeTone; children: ReactNode }) {
  return (
    <div role="status" className={cn("rounded-[var(--radius-control)] border px-4 py-3 text-sm", TONES[tone])}>
      {children}
    </div>
  );
}
