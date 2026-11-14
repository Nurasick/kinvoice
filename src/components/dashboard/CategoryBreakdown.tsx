import { categoryLabel } from "@/components/log/labels";
import type { MonthlyBalance } from "@/shared/domain";
import { Card, CardHeader, Duration, Money } from "@/components/ui";
import { categoryRows, type CategoryRow } from "./dashboard-view";

/** Where the money went and where the time went, as simple ranked bars. */
export function CategoryBreakdown({ balance }: { balance: MonthlyBalance }) {
  const money = categoryRows(balance.byExpenseCategory);
  const time = categoryRows(balance.byTimeCategory);
  return (
    <Card>
      <CardHeader title="Where it went" />
      <div className="grid gap-8 md:grid-cols-2">
        <Bars title="Money" rows={money} kind="money" empty="No expenses this month." />
        <Bars title="Time" rows={time} kind="time" empty="No care time logged this month." />
      </div>
    </Card>
  );
}

interface BarsProps {
  title: string;
  rows: readonly CategoryRow[];
  kind: "money" | "time";
  empty: string;
}

function Bars({ title, rows, kind, empty }: BarsProps) {
  return (
    <section aria-label={`${title} by category`}>
      <h3 className="mb-3 text-xs font-medium tracking-wide text-ink-muted uppercase">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.category}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 text-ink-soft">{categoryLabel(row.category)}</span>
                {kind === "money" ? (
                  <Money cents={row.value} className="shrink-0 font-medium whitespace-nowrap" />
                ) : (
                  <Duration minutes={row.value} className="shrink-0 font-medium whitespace-nowrap" />
                )}
              </div>
              <div aria-hidden className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${kind === "money" ? "bg-chart-money-track" : "bg-chart-time-track"}`}>
                <div
                  className={
                    kind === "money"
                      ? "h-full rounded-full bg-chart-money"
                      : "h-full rounded-full bg-chart-time"
                  }
                  style={{ width: `${Math.max(row.barFraction * 100, 3)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
