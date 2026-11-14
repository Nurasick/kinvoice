/** Where the money and time went, so siblings can see every number behind the suggestion. */
import { categoryLabel, shortDate } from "@/components/log/labels";
import type { PublicInvoice } from "@/shared/domain";
import { Card, Duration, Money } from "@/components/ui";
import { groupExpenses, timeEntries } from "./public-invoice-view";

export function MonthBreakdown({ invoice }: { invoice: PublicInvoice }) {
  const s = invoice.snapshot;
  const names = new Map(s.members.map((m) => [m.memberId, m.name]));
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="font-display text-xl font-medium">Who gave what</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Costs are shared equally. Time is shown for recognition and valued at{" "}
          <Money cents={s.hourlyRateCents} />
          /hr, but it is never added to anyone’s contribution.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-muted">
                <th className="py-2 pr-3 font-medium">Name</th>
                <th className="py-2 pr-3 text-right font-medium">Paid</th>
                <th className="py-2 pr-3 text-right font-medium">Time</th>
                <th className="py-2 text-right font-medium">
                  <span className="sm:hidden">Suggested</span>
                  <span className="hidden sm:inline">Suggested contribution</span>
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
                  <td className="py-2.5 pr-3 text-right">
                    {m.minutes > 0 ? <Duration minutes={m.minutes} /> : "—"}
                  </td>
                  <td className="py-2.5 text-right">
                    {m.role === "caregiver" ? (
                      <span className="text-ink-muted">Caregiver</span>
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

      <Card>
        <h2 className="font-display text-xl font-medium">Where the money went</h2>
        <div className="mt-4 flex flex-col gap-5">
          {groupExpenses(invoice.entries).map((g) => (
            <section key={g.category} aria-label={categoryLabel(g.category)}>
              <div className="flex items-baseline justify-between border-b border-line pb-1.5">
                <h3 className="text-sm font-medium text-ink">{categoryLabel(g.category)}</h3>
                <Money cents={g.totalCents} className="text-sm font-medium" />
              </div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {g.entries.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="min-w-0 truncate text-ink-soft">
                      {shortDate(e.date)} · {e.merchant ?? e.note ?? categoryLabel(e.category)}
                      <span className="text-ink-muted"> · paid by {names.get(e.memberId) ?? "family"}</span>
                    </span>
                    <Money cents={e.amountCents} className="text-ink-muted" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Card>

      <TimeCard invoice={invoice} names={names} />
    </div>
  );
}

function TimeCard({ invoice, names }: { invoice: PublicInvoice; names: Map<string, string> }) {
  const list = timeEntries(invoice.entries);
  if (list.length === 0) return null;
  return (
    <Card>
      <h2 className="font-display text-xl font-medium">Time given</h2>
      <p className="mt-1 text-sm text-ink-muted">
        <Duration minutes={invoice.snapshot.totalMinutes} /> of care this month.
      </p>
      <ul className="mt-4 flex flex-col divide-y divide-line">
        {list.map((e) => (
          <li key={e.id} className="flex items-baseline justify-between gap-4 py-2 text-sm">
            <span className="min-w-0 text-ink-soft">
              {shortDate(e.date)} · {e.note || categoryLabel(e.category)}
              <span className="text-ink-muted"> · {names.get(e.memberId) ?? "family"}</span>
            </span>
            <Duration minutes={e.minutes} className="text-ink-muted" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
