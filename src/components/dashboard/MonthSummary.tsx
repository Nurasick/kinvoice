import type { MonthlyBalance } from "@/shared/domain";
import { Card, Duration, Money } from "@/components/ui";
import { totalSuggestedCents } from "./dashboard-view";

/** The three headline numbers: money spent, time given, and what siblings are asked to share. */
export function MonthSummary({ balance }: { balance: MonthlyBalance }) {
  const suggested = totalSuggestedCents(balance);
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card tone="accent" className="sm:col-span-1">
        <p className="text-sm font-medium text-accent-strong">Out-of-pocket care costs</p>
        <Money
          cents={balance.totalOutOfPocketCents}
          className="mt-2 block font-display text-4xl font-medium text-ink"
        />
        <p className="mt-2 text-sm text-ink-soft">Everything the family paid for care this month.</p>
      </Card>
      <Card>
        <p className="text-sm font-medium text-ink-muted">Care time given</p>
        <Duration minutes={balance.totalMinutes} className="mt-2 block font-display text-4xl font-medium" />
        <p className="mt-2 text-sm text-ink-muted">
          Worth <Money cents={balance.totalTimeValueCents} /> at <Money cents={balance.hourlyRateCents} />
          /hr. Shown for recognition, not split.
        </p>
      </Card>
      <Card>
        <p className="text-sm font-medium text-ink-muted">Suggested from siblings</p>
        <Money cents={suggested} className="mt-2 block font-display text-4xl font-medium" />
        <p className="mt-2 text-sm text-ink-muted">An equal share of costs, minus what each already paid.</p>
      </Card>
    </div>
  );
}
