/** Where the money and time went, so siblings can see every number behind the suggestion. */
import type { Locale } from "@/lib/i18n/locales";
import { formatDuration } from "@/lib/i18n/format";
import { formatCents } from "@/lib/money";
import type { PublicInvoice } from "@/shared/domain";
import { Card, Money } from "@/components/ui";
import { categoryName, siblingCopy, type SiblingCopy } from "./copy";
import { dayLabel, groupExpenses, timeEntries } from "./public-invoice-view";

interface Props {
  invoice: PublicInvoice;
  locale: Locale;
}

export function MonthBreakdown({ invoice, locale }: Props) {
  const copy = siblingCopy(locale);
  const names = new Map(invoice.snapshot.members.map((m) => [m.memberId, m.name]));
  return (
    <div className="flex flex-col gap-6">
      <WhoGaveWhat invoice={invoice} locale={locale} copy={copy} />
      <Card>
        <h2 className="font-display text-xl font-medium">{copy.breakdown.moneyTitle}</h2>
        <div className="mt-4 flex flex-col gap-5">
          {groupExpenses(invoice.entries).map((g) => (
            <section key={g.category} aria-label={categoryName(copy, g.category)}>
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5">
                <h3 className="min-w-0 text-sm font-medium text-ink">{categoryName(copy, g.category)}</h3>
                <Money cents={g.totalCents} className="text-sm font-medium" />
              </div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {g.entries.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="min-w-0 truncate text-ink-soft">
                      {dayLabel(e.date, locale)} · {e.merchant ?? e.note ?? categoryName(copy, e.category)}
                      <span className="text-ink-muted">
                        {" · "}
                        {copy.breakdown.paidBy({ name: names.get(e.memberId) ?? copy.breakdown.family })}
                      </span>
                    </span>
                    <Money cents={e.amountCents} className="text-ink-muted" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Card>
      <TimeCard invoice={invoice} locale={locale} copy={copy} names={names} />
    </div>
  );
}

function WhoGaveWhat({ invoice, locale, copy }: Props & { copy: SiblingCopy }) {
  const s = invoice.snapshot;
  const b = copy.breakdown;
  return (
    <Card>
      <h2 className="font-display text-xl font-medium">{b.whoTitle}</h2>
      <p className="mt-1 text-sm text-ink-muted">{b.whoBody({ rate: formatCents(s.hourlyRateCents) })}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="py-2 pr-3 font-medium">{b.colName}</th>
              <th className="py-2 pr-3 text-right font-medium">{b.colPaid}</th>
              <th className="py-2 pr-3 text-right font-medium">{b.colTime}</th>
              <th className="py-2 text-right font-medium">
                <span className="sm:hidden">{b.colSuggestedShort}</span>
                <span className="hidden sm:inline">{b.colSuggested}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {s.members.map((m) => (
              <tr key={m.memberId}>
                <td className="py-2.5 pr-3 font-medium text-ink">{m.name}</td>
                <td className="py-2.5 pr-3 text-right">
                  <Money cents={m.paidCents} />
                </td>
                <td className="py-2.5 pr-3 text-right whitespace-nowrap tabular-nums">
                  {m.minutes > 0 ? formatDuration(m.minutes, locale) : "—"}
                </td>
                <td className="py-2.5 text-right">
                  {m.role === "caregiver" ? (
                    <span className="text-ink-muted">{b.caregiverRole}</span>
                  ) : (
                    <Money cents={m.suggestedContributionCents} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface TimeCardProps extends Props {
  copy: SiblingCopy;
  names: Map<string, string>;
}

function TimeCard({ invoice, locale, copy, names }: TimeCardProps) {
  const list = timeEntries(invoice.entries);
  if (list.length === 0) return null;
  const b = copy.breakdown;
  return (
    <Card>
      <h2 className="font-display text-xl font-medium">{b.timeTitle}</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {b.timeTotal({ duration: formatDuration(invoice.snapshot.totalMinutes, locale) })}
      </p>
      <ul className="mt-4 flex flex-col divide-y divide-line">
        {list.map((e) => (
          <li key={e.id} className="flex items-baseline justify-between gap-4 py-2 text-sm">
            <span className="min-w-0 text-ink-soft">
              {dayLabel(e.date, locale)} · {e.note || categoryName(copy, e.category)}
              <span className="text-ink-muted"> · {names.get(e.memberId) ?? b.family}</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-ink-muted tabular-nums">
              {formatDuration(e.minutes, locale)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
