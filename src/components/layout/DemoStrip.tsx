"use client";
/**
 * Inside a demo copy of Sarah's family only: says so, and offers the way back to the landing
 * (to switch language, re-read the pitch or start a real family). Real caregivers never see it.
 */
import Link from "next/link";
import { useWorkspace } from "./WorkspaceProvider";

export function DemoStrip({ line, back }: { line: string; back: string }) {
  const { view } = useWorkspace();
  if (!view.workspace.isDemo) return null;
  return (
    <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--radius-control)] bg-surface px-4 py-2.5 text-sm text-ink-soft shadow-[var(--shadow-card)]">
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-marigold" />
      <span className="min-w-[14rem] flex-1">{line}</span>
      <Link
        href="/"
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:text-accent-strong hover:decoration-accent-strong"
      >
        ← {back}
      </Link>
    </p>
  );
}
