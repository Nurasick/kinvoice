/**
 * The month in one sentence, answer first: who carried the costs, what each sibling is asked
 * to chip in, and where the invoice stands. Numbers come from MonthlyBalance (lib/money).
 */
import type { Locale } from "@/lib/i18n/locales";
import { formatCents } from "@/lib/money";
import type { Invoice, MonthlyBalance } from "@/shared/domain";
import { Money } from "@/components/ui";
import { dashboardCopy } from "./copy";
import { leadPayer, suggestedSiblings } from "./dashboard-view";
import { monthProgress } from "./month-progress";
import type { Settlement } from "./settlement";

export interface MonthHeadlineProps {
  balance: MonthlyBalance;
  month: string;
  entries: number;
  invoices: readonly Invoice[];
  /** Payment status from the invoice sent for this month, if any. */
  settlement: Settlement | null;
  locale: Locale;
}

export function MonthHeadline({ balance, month, entries, invoices, settlement, locale }: MonthHeadlineProps) {
  const t = dashboardCopy(locale).headline;
  const lead = leadPayer(balance);
  // Once an invoice is out, only what is still open is "asked"; settled siblings drop off the line.
  const asks = settlement
    ? settlement.rows.filter((r) => r.status === "waiting" || r.status === "sent").map((r) => r.member)
    : suggestedSiblings(balance);
  return (
    <section aria-label={t.label} className="flex flex-col gap-3">
      <p className="max-w-3xl font-display text-2xl leading-snug font-bold text-balance text-ink sm:text-3xl">
        {lead
          ? t.lead({ name: lead.name, pct: lead.sharePct, total: formatCents(balance.totalOutOfPocketCents) })
          : t.noCosts}
      </p>
      {asks.length > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink-soft">
          <span>{settlement ? t.stillToCome : t.suggested}</span>
          {asks.map((m) => (
            <span key={m.memberId} className="whitespace-nowrap">
              {m.name} <Money cents={m.suggestedContributionCents} className="font-semibold text-ink" />
            </span>
          ))}
        </p>
      )}
      <InvoiceStatus
        month={month}
        entries={entries}
        invoices={invoices}
        settlement={settlement}
        locale={locale}
      />
    </section>
  );
}

function InvoiceStatus({
  month,
  entries,
  invoices,
  settlement,
  locale,
}: Omit<MonthHeadlineProps, "balance">) {
  const t = dashboardCopy(locale).headline;
  const p = monthProgress(entries, invoices, month);
  const { settled, total } = p.settled;
  const sentWord = p.sent.invoice ? t.sent : t.notSent;
  const detail =
    !p.sent.invoice || total === 0
      ? null
      : settled === total
        ? t.everyoneSettled
        : settled === 0
          ? t.nobodyYet
          : t.someSettled({ settled, total });
  return (
    <p className="flex items-center gap-2 text-sm text-ink-muted">
      <span
        aria-hidden
        className={
          p.next === "done"
            ? "size-2 rounded-full bg-success"
            : p.sent.invoice
              ? "size-2 rounded-full bg-marigold-deep"
              : "size-2 rounded-full bg-line-strong"
        }
      />
      {detail ? `${sentWord} · ${detail}` : sentWord}
      {settlement?.hasNewCosts && ` · ${t.newCosts}`}
    </p>
  );
}
