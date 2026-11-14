import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui";

export interface StatePanelProps {
  title: string;
  body: ReactNode;
  /** Primary action, e.g. a "Try again" button. */
  action?: ReactNode;
  /** Secondary escape hatch link. */
  home?: { href: string; label: string };
}

/** Full-width calm message for 404s and unexpected errors. Never shows a stack trace. */
export function StatePanel({ title, body, action, home }: StatePanelProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-start gap-4 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-medium text-balance sm:text-4xl">{title}</h1>
      <div className="text-ink-soft">{body}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {action}
        {home && (
          <Link href={home.href} className={buttonClass(action ? "secondary" : "primary")}>
            {home.label}
          </Link>
        )}
      </div>
    </div>
  );
}
