import Link from "next/link";
import { categoryLabel, shortDate } from "@/components/log/labels";
import type { Entry, Member } from "@/shared/domain";
import { Card, CardHeader, Duration, Money } from "@/components/ui";

const SHOWN = 6;

export interface RecentEntriesProps {
  entries: readonly Entry[];
  members: readonly Member[];
}

/** The latest few entries (API returns date desc), with a link to the full Log. */
export function RecentEntries({ entries, members }: RecentEntriesProps) {
  const names = new Map(members.map((m) => [m.id, m.name]));
  const shown = entries.slice(0, SHOWN);
  return (
    <Card>
      <CardHeader
        title="Recent entries"
        description={`${entries.length} logged this month`}
        action={
          <Link href="/app/log" className="text-sm font-medium text-accent hover:text-accent-strong">
            Open log →
          </Link>
        }
      />
      <ul className="flex flex-col divide-y divide-line">
        {shown.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{describe(entry)}</p>
              <p className="text-xs text-ink-muted">
                {shortDate(entry.date)} · {names.get(entry.memberId) ?? "Someone"}
              </p>
            </div>
            {entry.kind === "expense" ? (
              <Money cents={entry.amountCents} className="shrink-0 text-sm font-medium" />
            ) : (
              <Duration minutes={entry.minutes} className="shrink-0 text-sm font-medium text-ink-soft" />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function describe(entry: Entry): string {
  const category = categoryLabel(entry.category);
  if (entry.kind === "expense" && entry.merchant) return `${entry.merchant} · ${category}`;
  return entry.note ? `${category} · ${entry.note}` : category;
}
