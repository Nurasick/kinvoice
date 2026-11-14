/**
 * The month in one sentence, answer first: who carried the costs, what each sibling is asked
 * to chip in, and where the invoice stands. Numbers come from MonthlyBalance (lib/money).
 */
import { formatCents } from "@/lib/money";
import type { Invoice, MonthlyBalance } from "@/shared/domain";
import { Money } from "@/components/ui";
import { leadPayer, suggestedSiblings } from "./dashboard-view";
import { monthProgress } from "./month-progress";

export interface MonthHeadlineProps {
  balance: MonthlyBalance;
  month: string;
  entries: number;
  invoices: readonly Invoice[];
}

export function MonthHeadline({ balance, month, entries, invoices }: MonthHeadlineProps) {
  const lead = leadPayer(balance);
  const asks = suggestedSiblings(balance);
  return (
    <section aria-label="This month in one sentence" className="flex flex-col gap-3">
      <p className="max-w-3xl font-display text-2xl leading-snug font-bold text-balance text-ink sm:text-3xl">
        {lead
          ? `${lead.name} covered ${lead.sharePct}% of the ${formatCents(balance.totalOutOfPocketCents)} in care costs this month.`
          : "No care costs logged this month yet."}
      </p>
      {asks.length > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink-soft">
          <span>Suggested contributions:</span>
          {asks.map((m) => (
            <span key={m.memberId} className="whitespace-nowrap">
              {m.name} <Money cents={m.suggestedContributionCents} className="font-semibold text-ink" />
            </span>
          ))}
        </p>
      )}
      <InvoiceStatus month={month} entries={entries} invoices={invoices} />
    </section>
  );
}

function InvoiceStatus({ month, entries, invoices }: Omit<MonthHeadlineProps, "balance">) {
  const p = monthProgress(entries, invoices, month);
  const { settled, total } = p.settled;
  const sentWord = p.sent.invoice ? "Invoice sent" : "Invoice not sent yet";
  const detail =
    !p.sent.invoice || total === 0
      ? null
      : settled === total
        ? "everyone has settled"
        : settled === 0
          ? "nobody has chipped in yet"
          : `${settled} of ${total} settled`;
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
    </p>
  );
}
