import type { MonthlyBalance } from "@/shared/domain";
import { Duration, Money } from "@/components/ui";

/** What the invoice will show, computed by lib/money. Frozen as a snapshot when published. */
export function ContributionPreview({ balance }: { balance: MonthlyBalance }) {
  const siblings = balance.members.filter((m) => m.role === "sibling");
  const caregiver = balance.members.find((m) => m.role === "caregiver");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-ink-muted">Care costs this month</p>
        <Money cents={balance.totalOutOfPocketCents} className="font-display text-3xl font-medium" />
        {caregiver && (
          <p className="mt-1 text-sm text-ink-muted">
            {caregiver.name} paid <Money cents={caregiver.paidCents} /> and gave{" "}
            <Duration minutes={caregiver.minutes} />.
          </p>
        )}
      </div>
      <ul className="flex flex-col divide-y divide-line border-t border-line">
        {siblings.map((m) => (
          <li key={m.memberId} className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-sm text-ink">
              {m.name} <span className="text-ink-muted">· suggested contribution</span>
            </span>
            <Money cents={m.suggestedContributionCents} className="font-medium" />
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-muted">
        These numbers are frozen when you publish, so later edits never change a link you already sent.
      </p>
    </div>
  );
}
