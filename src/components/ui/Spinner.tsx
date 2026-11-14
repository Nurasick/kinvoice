import { cn } from "./cn";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  /** Screen-reader text. Pass "" when a parent already announces the busy state. */
  label?: string;
  className?: string;
}

const SIZES = { sm: "size-4 border-2", md: "size-6 border-2", lg: "size-9 border-[3px]" } as const;

export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role={label ? "status" : undefined} className={cn("inline-flex items-center", className)}>
      <span
        aria-hidden
        className={cn("animate-spin rounded-full border-current border-r-transparent opacity-70", SIZES[size])}
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

/** Centered spinner for a whole section or page while data loads. */
export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-40 flex-col items-center justify-center gap-3 text-ink-muted">
      <Spinner size="lg" label="" />
      <p className="text-sm">{label}…</p>
    </div>
  );
}
