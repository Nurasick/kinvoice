"use client";
import type { Invoice } from "@/shared/domain";
import { Button, Card, CopyButton, buttonClass, useOrigin } from "@/components/ui";
import { publicInvoiceUrl } from "./invoice-view";

export interface PublishedPanelProps {
  invoice: Invoice;
  monthName: string;
  onStartOver: () => void;
}

/** Shown right after publishing: the link to share with siblings. */
export function PublishedPanel({ invoice, monthName, onStartOver }: PublishedPanelProps) {
  const origin = useOrigin();
  const link = publicInvoiceUrl(origin, invoice.publicToken);
  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl font-medium">Your {monthName} invoice is ready to share</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Send this link to your siblings in your family chat or by text. They don’t need an account.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 truncate rounded-[var(--radius-control)] border border-accent/20 bg-surface px-3 py-2.5 font-mono text-sm text-ink-soft">
          {link}
        </code>
        <CopyButton value={link} label="Copy link" size="lg" variant="primary" />
      </div>
      <div className="flex flex-wrap gap-2">
        <a href={link} target="_blank" rel="noreferrer" className={buttonClass("secondary")}>
          Preview as a sibling
        </a>
        <Button variant="ghost" onClick={onStartOver}>
          Write another
        </Button>
      </div>
    </Card>
  );
}
