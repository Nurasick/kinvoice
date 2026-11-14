"use client";
import { useRef, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import { useLocale } from "@/lib/i18n/client";
import { monthLabel } from "@/components/log/labels";
import { dateLabel } from "@/components/dashboard/copy";
import { formatCents } from "@/lib/money";
import type { Invoice } from "@/shared/domain";
import { invoiceCopy, type InvoiceCopy } from "./copy";
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
  const { locale } = useLocale();
  const t = invoiceCopy(locale).list;
  if (invoices.length === 0) {
    return <EmptyState title={t.emptyTitle} description={t.emptyBody} />;
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
  const { locale } = useLocale();
  const t = invoiceCopy(locale).list;
  const rows = siblingRows(invoice);
  const settled = settledCount(rows);
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-medium">{monthLabel(invoice.month, locale)}</h3>
          <p className="text-sm text-ink-muted">
            {t.meta({
              date: dateLabel(invoice.publishedAt, locale),
              total: formatCents(invoice.snapshot.totalOutOfPocketCents),
              settled,
              count: rows.length,
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={publicInvoiceUrl(origin, invoice.publicToken)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center px-2 text-sm font-medium text-accent hover:text-accent-strong"
          >
            {t.open}
          </a>
          <CopyButton
            value={publicInvoiceUrl(origin, invoice.publicToken)}
            label={t.copyLink}
            copiedLabel={t.copied}
            size="sm"
          />
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

const TONE: Record<SiblingStatus, BadgeTone> = {
  waiting: "neutral",
  sent: "warning",
  received: "success",
  covered: "success",
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
  const { locale } = useLocale();
  const t: InvoiceCopy["list"] = invoiceCopy(locale).list;
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
      aria-label={`${row.member.name}: ${t.status[row.status]}`}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[var(--radius-control)] py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-medium text-ink">{row.member.name}</span>
        <Money cents={row.amountCents} className="text-sm text-ink-muted" />
        {/* Live region: screen readers hear "Received" after Mark as received, or a sibling's update. */}
        <span aria-live="polite">
          <Badge tone={TONE[row.status]}>{t.status[row.status]}</Badge>
        </span>
      </div>
      {canMark && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {failed && <span className="text-xs text-danger">{t.failed}</span>}
          {row.status === "waiting" && (
            <CopyButton
              value={personalLink(origin, publicToken, row.member.memberId, locale)}
              label={t.copyPersonal({ name: row.member.name })}
              copiedLabel={t.copied}
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
            {t.markReceived}
          </Button>
        </div>
      )}
    </li>
  );
}
