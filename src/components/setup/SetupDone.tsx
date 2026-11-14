"use client";
import Link from "next/link";
import { editLink } from "@/lib/workspace-key";
import { Card, CopyButton, buttonClass, useOrigin } from "@/components/ui";

/** Shown once after setup: the private edit link is the only way back in from another device. */
export function SetupDone({ editKey }: { editKey: string }) {
  const origin = useOrigin();
  const link = editLink(origin, editKey);

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-accent">Your family space is ready</p>
        <h1 className="mt-1 font-display text-3xl font-medium">Save your private link</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          There are no passwords. This link is your key: bookmark it or save it somewhere safe to get back in
          from any device. Don’t share it. Siblings get their own read-only link with each invoice.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 truncate rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink-soft">
          {link}
        </code>
        <CopyButton value={link} label="Copy link" size="lg" />
      </div>
      <div>
        <Link href="/app" className={buttonClass("primary", "lg")}>
          Go to my dashboard
        </Link>
      </div>
    </Card>
  );
}
