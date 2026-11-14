import { categoryLabel } from "@/components/log/labels";
import type { Locale } from "@/lib/i18n/locales";
import type { MonthlyBalance } from "@/shared/domain";
import { Card, CardHeader, Duration, Money } from "@/components/ui";
import { dashboardCopy } from "./copy";
import { categoryRows, type CategoryRow } from "./dashboard-view";

/** Where the money went and where the time went, as simple ranked bars. */
export function CategoryBreakdown({ balance, locale }: { balance: MonthlyBalance; locale: Locale }) {
  const t = dashboardCopy(locale).categories;
  const money = categoryRows(balance.byExpenseCategory);
  const time = categoryRows(balance.byTimeCategory);
  return (
    <Card>
      <CardHeader title={t.title} />
      <div className="grid gap-8 md:grid-cols-2">
        <Bars
          title={t.money}
          label={t.byCategory({ title: t.money })}
          rows={money}
          kind="money"
          empty={t.noExpenses}
          locale={locale}
        />
        <Bars
          title={t.time}
          label={t.byCategory({ title: t.time })}
          rows={time}
          kind="time"
          empty={t.noTime}
          locale={locale}
        />
      </div>
    </Card>
  );
}

interface BarsProps {
  title: string;
  label: string;
  locale: Locale;
  rows: readonly CategoryRow[];
  kind: "money" | "time";
  empty: string;
}

function Bars({ title, label, rows, kind, empty, locale }: BarsProps) {
  return (
    <section aria-label={label}>
      <h3 className="mb-3 text-xs font-medium tracking-wide text-ink-muted uppercase">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.category}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 text-ink-soft">{categoryLabel(row.category, locale)}</span>
                {kind === "money" ? (
                  <Money cents={row.value} className="shrink-0 font-medium whitespace-nowrap" />
                ) : (
                  <Duration
                    locale={locale}
                    minutes={row.value}
                    className="shrink-0 font-medium whitespace-nowrap"
                  />
                )}
              </div>
              <div
                aria-hidden
                className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${kind === "money" ? "bg-chart-money-track" : "bg-chart-time-track"}`}
              >
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
