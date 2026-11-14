/**
 * "Is it fair?" One row per person on a shared scale: money paid (cobalt) and time given
 * (marigold) as separate bars against the month's totals, then the suggested contribution.
 */
import type { ReactNode } from "react";
import type { MonthlyBalance } from "@/shared/domain";
import { Badge, Card, Duration, Money } from "@/components/ui";
import { memberMeters, type MemberMeter } from "./dashboard-view";

export function MemberBalances({ balance }: { balance: MonthlyBalance }) {
  const rows = memberMeters(balance);
  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-lg font-bold text-ink">Who gave what</h2>
        <Legend />
      </div>
      <ul className="flex flex-col divide-y divide-line">
        {rows.map((row) => (
          <MemberRow key={row.member.memberId} row={row} />
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">
        Costs are split equally. Care time is worth <Money cents={balance.totalTimeValueCents} /> at{" "}
        <Money cents={balance.hourlyRateCents} />
        /hr, shown for recognition and never added to a contribution.
      </p>
    </Card>
  );
}

function Legend() {
  return (
    <p className="flex gap-4 text-xs text-ink-muted">
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-4 rounded-full bg-accent" /> Money paid
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-4 rounded-full bg-marigold-deep" /> Time given
      </span>
    </p>
  );
}

function MemberRow({ row }: { row: MemberMeter }) {
  const m = row.member;
  return (
    <li className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr_9rem] sm:items-center sm:gap-6">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{m.name}</p>
        <p className="text-xs text-ink-muted">{m.role === "caregiver" ? "Caregiver" : "Sibling"}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <Meter fraction={row.moneyFraction} tone="money" label={`${m.name}, money paid`}>
          <Money cents={m.paidCents} />
        </Meter>
        <Meter fraction={row.timeFraction} tone="time" label={`${m.name}, time given`}>
          {m.minutes > 0 ? <Duration minutes={m.minutes} /> : <span className="text-ink-muted">—</span>}
        </Meter>
      </div>
      <div className="sm:text-right">
        <Contribution row={row} />
      </div>
    </li>
  );
}

interface MeterProps {
  fraction: number;
  tone: "money" | "time";
  label: string;
  children: ReactNode;
}

/** Bar on the month-total scale with its figure beside it (the figure, not the colour, carries the value). */
function Meter({ fraction, tone, label, children }: MeterProps) {
  const pct = Math.round(fraction * 100);
  return (
    <div className="grid grid-cols-[1fr_5.5rem] items-center gap-3">
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${pct}% of this month's total`}
        className="h-2 overflow-hidden rounded-full bg-paper-deep"
      >
        {fraction > 0 && (
          <div
            className={
              tone === "money" ? "h-full rounded-full bg-accent" : "h-full rounded-full bg-marigold-deep"
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

function Contribution({ row }: { row: MemberMeter }) {
  const m = row.member;
  if (m.role === "caregiver") return <Badge tone="accent">Carrying this month</Badge>;
  if (m.suggestedContributionCents === 0) return <Badge tone="success">Covered their share</Badge>;
  return (
    <div className="flex items-baseline justify-between gap-2 rounded-[var(--radius-control)] bg-paper px-3 py-2 sm:block sm:bg-transparent sm:p-0">
      <p className="text-xs text-ink-muted">Suggested contribution</p>
      <Money cents={m.suggestedContributionCents} className="font-display text-lg font-bold text-ink" />
    </div>
  );
}
