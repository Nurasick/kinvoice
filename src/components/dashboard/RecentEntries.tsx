import Link from "next/link";
import { categoryLabel, shortDate } from "@/components/log/labels";
import type { Locale } from "@/lib/i18n/locales";
import type { Entry, Member } from "@/shared/domain";
import { Card, CardHeader, Duration, Money } from "@/components/ui";
import { dashboardCopy } from "./copy";

const SHOWN = 6;

export interface RecentEntriesProps {
  entries: readonly Entry[];
  members: readonly Member[];
  locale: Locale;
}

/** The latest few entries (API returns date desc), with a link to the full Log. */
export function RecentEntries({ entries, members, locale }: RecentEntriesProps) {
  const t = dashboardCopy(locale).recent;
  const names = new Map(members.map((m) => [m.id, m.name]));
  const shown = entries.slice(0, SHOWN);
  return (
    <Card>
      <CardHeader
        title={t.title}
        description={t.logged({ n: entries.length })}
        action={
          <Link href="/app/log" className="text-sm font-medium text-accent hover:text-accent-strong">
            {t.openLog}
          </Link>
        }
      />
      <ul className="flex flex-col divide-y divide-line">
        {shown.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{describe(entry, locale)}</p>
              <p className="text-xs text-ink-muted">
                {shortDate(entry.date, locale)} · {names.get(entry.memberId) ?? t.someone}
              </p>
            </div>
            {entry.kind === "expense" ? (
              <Money cents={entry.amountCents} className="shrink-0 text-sm font-medium" />
            ) : (
              <Duration
                locale={locale}
                minutes={entry.minutes}
                className="shrink-0 text-sm font-medium text-ink-soft"
              />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function describe(entry: Entry, locale: Locale): string {
  const category = categoryLabel(entry.category, locale);
  if (entry.kind === "expense" && entry.merchant) return `${entry.merchant} · ${category}`;
  return entry.note ? `${category} · ${entry.note}` : category;
}
