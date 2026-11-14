import type { Locale } from "@/lib/i18n/locales";
import { formatDuration } from "@/lib/i18n/format";
import { formatCents } from "@/lib/money";
import type { MonthlyBalance } from "@/shared/domain";
import { Money } from "@/components/ui";
import { invoiceCopy } from "./copy";

/** What the invoice will show, computed by lib/money. Frozen as a snapshot when published. */
export function ContributionPreview({ balance, locale }: { balance: MonthlyBalance; locale: Locale }) {
  const t = invoiceCopy(locale).preview;
  const siblings = balance.members.filter((m) => m.role === "sibling");
  const caregiver = balance.members.find((m) => m.role === "caregiver");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-ink-muted">{t.costs}</p>
        <Money cents={balance.totalOutOfPocketCents} className="font-display text-3xl font-medium" />
        {caregiver && (
          <p className="mt-1 text-sm text-ink-muted">
            {t.caregiverLine({
              name: caregiver.name,
              paid: formatCents(caregiver.paidCents),
              time: formatDuration(caregiver.minutes, locale),
            })}
          </p>
        )}
      </div>
      <ul className="flex flex-col divide-y divide-line border-t border-line">
        {siblings.map((m) => (
          <li key={m.memberId} className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-sm text-ink">
              {m.name} <span className="text-ink-muted">· {t.suggested}</span>
            </span>
            <Money cents={m.suggestedContributionCents} className="font-medium" />
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-muted">{t.frozen}</p>
    </div>
  );
}
