import type { ReactNode } from "react";
import type { MemberBalance, MonthlyBalance } from "@/shared/domain";
import { Badge, Card, CardHeader, Duration, Money } from "@/components/ui";
import { orderedMembers } from "./dashboard-view";

/** Who paid what, who gave time, and each sibling's suggested contribution. */
export function MemberBalances({ balance }: { balance: MonthlyBalance }) {
  const members = orderedMembers(balance);
  return (
    <Card>
      <CardHeader
        title="Who gave what"
        description="Costs are split equally. Time is valued separately and never added to a contribution."
      />
      <ul className="flex flex-col divide-y divide-line">
        {members.map((m) => (
          <MemberRow key={m.memberId} member={m} />
        ))}
      </ul>
    </Card>
  );
}

function MemberRow({ member }: { member: MemberBalance }) {
  const isCaregiver = member.role === "caregiver";
  return (
    <li className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1.3fr_1fr_1fr_1.2fr] sm:items-center">
      <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
        <Initial name={member.name} />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{member.name}</p>
          <p className="text-xs text-ink-muted">{isCaregiver ? "Caregiver" : "Sibling"}</p>
        </div>
      </div>
      <Stat label="Paid">
        <Money cents={member.paidCents} />
      </Stat>
      <Stat label="Time given">
        {member.minutes > 0 ? (
          <Duration minutes={member.minutes} />
        ) : (
          <span className="text-ink-muted">—</span>
        )}
      </Stat>
      <div className="col-span-2 sm:col-span-1 sm:text-right">
        <Contribution member={member} />
      </div>
    </li>
  );
}

function Contribution({ member }: { member: MemberBalance }) {
  if (member.role === "caregiver") return <Badge tone="accent">Carrying this month</Badge>;
  if (member.suggestedContributionCents === 0) return <Badge tone="success">Covered their share</Badge>;
  return (
    <div className="flex items-baseline justify-between gap-2 rounded-[var(--radius-control)] bg-paper px-3 py-2 sm:block sm:bg-transparent sm:p-0">
      <p className="text-xs text-ink-muted">Suggested contribution</p>
      <Money
        cents={member.suggestedContributionCents}
        className="font-display text-lg font-medium text-ink"
      />
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="text-sm font-medium text-ink">{children}</p>
    </div>
  );
}

function Initial({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep font-display text-sm text-ink-soft"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
