"use client";
import { useRef, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import { monthLabel } from "@/components/log/labels";
import type { Invoice } from "@/shared/domain";
import { personalLink } from "./share-links";
import {
  Badge,
  Button,
  Card,
  CopyButton,
  EmptyState,
  Money,
  useOrigin,
  type BadgeTone,
} from "@/components/ui";
import {
  publicInvoiceUrl,
  publishedLabel,
  settledCount,
  siblingRows,
  type SiblingRow,
  type SiblingStatus,
} from "./invoice-view";

export interface InvoiceListProps {
  api: WorkspaceApi;
  invoices: readonly Invoice[];
  onChanged: () => void;
}

export function InvoiceList({ api, invoices, onChanged }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices sent yet"
        description="When you publish one, it shows up here so you can see who has chipped in."
      />
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {invoices.map((inv) => (
        <li key={inv.id}>
          <InvoiceCard api={api} invoice={inv} onChanged={onChanged} />
        </li>
      ))}
    </ul>
  );
}

function InvoiceCard({
  api,
  invoice,
  onChanged,
}: {
  api: WorkspaceApi;
  invoice: Invoice;
  onChanged: () => void;
}) {
  const origin = useOrigin();
  const rows = siblingRows(invoice);
  const settled = settledCount(rows);
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-medium">{monthLabel(invoice.month)}</h3>
          <p className="text-sm text-ink-muted">
            Published {publishedLabel(invoice.publishedAt)} ·{" "}
            <Money cents={invoice.snapshot.totalOutOfPocketCents} /> in care costs · {settled} of{" "}
            {rows.length} settled
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={publicInvoiceUrl(origin, invoice.publicToken)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center px-2 text-sm font-medium text-accent hover:text-accent-strong"
          >
            Open
          </a>
          <CopyButton value={publicInvoiceUrl(origin, invoice.publicToken)} label="Copy link" size="sm" />
        </div>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-line border-t border-line">
        {rows.map((row) => (
          <SiblingPayment
            key={row.member.memberId}
            api={api}
            invoiceId={invoice.id}
            publicToken={invoice.publicToken}
            row={row}
            onChanged={onChanged}
          />
        ))}
      </ul>
    </Card>
  );
}

const STATUS: Record<SiblingStatus, { label: string; tone: BadgeTone }> = {
  waiting: { label: "Not yet", tone: "neutral" },
  sent: { label: "Says it’s sent", tone: "warning" },
  received: { label: "Received", tone: "success" },
  covered: { label: "Covered their share", tone: "success" },
};

interface SiblingPaymentProps {
  api: WorkspaceApi;
  invoiceId: string;
  publicToken: string;
  row: SiblingRow;
  onChanged: () => void;
}

function SiblingPayment({ api, invoiceId, publicToken, row, onChanged }: SiblingPaymentProps) {
  const origin = useOrigin();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);
  const canMark = row.status === "waiting" || row.status === "sent";

  async function markReceived(): Promise<void> {
    setBusy(true);
    setFailed(false);
    try {
      await api.markReceived(invoiceId, {
        memberId: row.member.memberId,
        amountCents: row.amountCents,
        method: row.method,
      });
      onChanged();
      // The button disappears once received: keep keyboard focus on this sibling's row, not the page top.
      rowRef.current?.focus();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li
      ref={rowRef}
      tabIndex={-1}
      aria-label={`${row.member.name}: ${STATUS[row.status].label}`}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[var(--radius-control)] py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-medium text-ink">{row.member.name}</span>
        <Money cents={row.amountCents} className="text-sm text-ink-muted" />
        {/* Live region: screen readers hear "Received" after Mark as received, or a sibling's update. */}
        <span aria-live="polite">
          <Badge tone={STATUS[row.status].tone}>{STATUS[row.status].label}</Badge>
        </span>
      </div>
      {canMark && (
        <div className="flex items-center gap-2">
          {failed && <span className="text-xs text-danger">Didn’t save. Try again.</span>}
          {row.status === "waiting" && (
            <CopyButton
              value={personalLink(origin, publicToken, row.member.memberId)}
              label={`Copy ${row.member.name}’s link`}
              variant="ghost"
              size="sm"
            />
          )}
          <Button
            variant={row.status === "sent" ? "primary" : "secondary"}
            size="sm"
            onClick={() => void markReceived()}
            isLoading={busy}
          >
            Mark as received
          </Button>
        </div>
      )}
    </li>
  );
}
