/**
 * "Is it fair?" One row per person on a shared scale: money paid (cobalt) and time given
 * (marigold) as separate bars against the month's totals, then the suggested contribution.
 */
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { formatCents } from "@/lib/money";
import type { MonthlyBalance } from "@/shared/domain";
import type { SiblingRow } from "@/components/invoice/invoice-view";
import { Badge, Card, Duration, Money } from "@/components/ui";
import { dashboardCopy, type DashboardCopy } from "./copy";
import { memberMeters, type MemberMeter } from "./dashboard-view";
import { rowFor, type Settlement } from "./settlement";

export interface MemberBalancesProps {
  balance: MonthlyBalance;
  /** Payment status from the invoice sent for this month, if any. */
  settlement: Settlement | null;
  locale: Locale;
}

export function MemberBalances({ balance, settlement, locale }: MemberBalancesProps) {
  const t = dashboardCopy(locale).members;
  const rows = memberMeters(balance);
  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-lg font-bold text-ink">{t.title}</h2>
        <Legend t={t} />
      </div>
      <ul className="flex flex-col divide-y divide-line">
        {rows.map((row) => (
          <MemberRow
            key={row.member.memberId}
            row={row}
            payment={rowFor(settlement, row.member.memberId)}
            t={t}
            locale={locale}
          />
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">
        {t.footnote({
          value: formatCents(balance.totalTimeValueCents),
          rate: formatCents(balance.hourlyRateCents),
        })}
      </p>
    </Card>
  );
}

type MembersCopy = DashboardCopy["members"];

function Legend({ t }: { t: MembersCopy }) {
  return (
    <p className="flex gap-4 text-xs text-ink-muted">
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-4 rounded-full bg-chart-money" /> {t.moneyPaid}
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-4 rounded-full bg-chart-time" /> {t.timeGiven}
      </span>
    </p>
  );
}

interface MemberRowProps {
  row: MemberMeter;
  payment: SiblingRow | undefined;
  t: MembersCopy;
  locale: Locale;
}

function MemberRow({ row, payment, t, locale }: MemberRowProps) {
  const m = row.member;
  return (
    <li className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr_9rem] sm:items-center sm:gap-6">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{m.name}</p>
        <p className="text-xs text-ink-muted">{m.role === "caregiver" ? t.caregiver : t.sibling}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <Meter
          fraction={row.moneyFraction}
          tone="money"
          label={t.meterMoney({ name: m.name })}
          valueText={t.meterValue}
        >
          <Money cents={m.paidCents} />
        </Meter>
        <Meter
          fraction={row.timeFraction}
          tone="time"
          label={t.meterTime({ name: m.name })}
          valueText={t.meterValue}
        >
          {m.minutes > 0 ? (
            <Duration locale={locale} minutes={m.minutes} />
          ) : (
            <span className="text-ink-muted">—</span>
          )}
        </Meter>
      </div>
      <div className="sm:text-right">
        <Contribution row={row} payment={payment} t={t} />
      </div>
    </li>
  );
}

interface MeterProps {
  fraction: number;
  tone: "money" | "time";
  label: string;
  valueText: (p: { pct: number }) => string;
  children: ReactNode;
}

/** Bar on the month-total scale with its figure beside it (the figure, not the colour, carries the value). */
function Meter({ fraction, tone, label, valueText, children }: MeterProps) {
  const pct = Math.round(fraction * 100);
  return (
    <div className="grid grid-cols-[1fr_5.5rem] items-center gap-3">
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={valueText({ pct })}
        className={`h-2 overflow-hidden rounded-full ${tone === "money" ? "bg-chart-money-track" : "bg-chart-time-track"}`}
      >
        {fraction > 0 && (
          <div
            className={
              tone === "money" ? "h-full rounded-full bg-chart-money" : "h-full rounded-full bg-chart-time"
            }
            style={{ width: `${Math.max(fraction * 100, 2)}%` }}
          />
        )}
      </div>
      <span className="text-right text-sm font-medium whitespace-nowrap text-ink tabular-nums">
        {children}
      </span>
    </div>
  );
}

const PAID: Record<
  "received" | "sent" | "waiting",
  { label: "received" | "saysSent" | "notPaid"; tone: "success" | "warning" | "neutral" }
> = {
  received: { label: "received", tone: "success" },
  sent: { label: "saysSent", tone: "warning" },
  waiting: { label: "notPaid", tone: "neutral" },
};

/** Before an invoice: the suggestion. After: what the sibling was sent and whether it arrived. */
function Contribution({
  row,
  payment,
  t,
}: {
  row: MemberMeter;
  payment: SiblingRow | undefined;
  t: MembersCopy;
}) {
  const m = row.member;
  if (m.role === "caregiver") return <Badge tone="accent">{t.carrying}</Badge>;
  if (payment && payment.status !== "covered") {
    const s = PAID[payment.status];
    const cents =
      payment.status === "waiting" ? payment.member.suggestedContributionCents : payment.amountCents;
    return (
      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:gap-1">
        <Money cents={cents} className="font-display text-lg font-bold text-ink" />
        <Badge tone={s.tone}>{t[s.label]}</Badge>
      </div>
    );
  }
  if (m.suggestedContributionCents === 0) return <Badge tone="success">{t.covered}</Badge>;
  return (
    <div className="flex items-baseline justify-between gap-2 rounded-[var(--radius-control)] bg-paper px-3 py-2 sm:block sm:bg-transparent sm:p-0">
      <p className="text-xs text-ink-muted">{t.suggested}</p>
      <Money cents={m.suggestedContributionCents} className="font-display text-lg font-bold text-ink" />
    </div>
  );
}
