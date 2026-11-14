/**
 * Numbers for the landing-page hero, computed from the real demo seed with the real money math,
 * so the illustration can never drift from what "Try Sarah's family" shows. Server-side only
 * (imported by the landing page server component, never by client code).
 */
import { computeMonthlyBalance } from "@/lib/money";
import { DEMO_MEMBERS, DEMO_WORKSPACE, buildDemoEntries } from "@/server/seed/demo-family";
import type { Entry, ExpenseEntry, Member, MemberBalance, TimeEntry } from "@/shared/domain";

export interface DemoHero {
  caregiver: MemberBalance;
  sibling: MemberBalance;
  totalOutOfPocketCents: number;
  firstExpense: ExpenseEntry;
  firstTime: TimeEntry;
}

const CREATED_AT = "2026-01-01T00:00:00.000Z";

export function demoHero(today: Date = new Date()): DemoHero {
  const members: Member[] = DEMO_MEMBERS.map(({ key, name, role, email }) => ({
    id: key,
    name,
    role,
    email,
  }));
  const ids = { sarah: "sarah", mike: "mike", emily: "emily" } as const;
  const entries: Entry[] = buildDemoEntries(today, ids).map((e, i) => ({
    ...e,
    id: `e${i}`,
    createdAt: CREATED_AT,
  }));
  const month = entries[0].date.slice(0, 7);
  const balance = computeMonthlyBalance({
    month,
    members,
    entries,
    hourlyRateCents: DEMO_WORKSPACE.hourlyRateCents,
  });

  const byId = new Map(balance.members.map((m) => [m.memberId, m]));
  const firstExpense = entries.find((e): e is ExpenseEntry => e.kind === "expense");
  const firstTime = entries.find((e): e is TimeEntry => e.kind === "time");
  const caregiver = byId.get("sarah");
  const sibling = byId.get("mike");
  if (!firstExpense || !firstTime || !caregiver || !sibling)
    throw new Error("Demo seed is missing hero data");

  return {
    caregiver,
    sibling,
    totalOutOfPocketCents: balance.totalOutOfPocketCents,
    firstExpense,
    firstTime,
  };
}
