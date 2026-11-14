/**
 * Numbers for the landing page, computed from the real demo seed with the real money math, so the page
 * can never drift from what "Try Sarah's family" opens. Server-only: imported by the landing server
 * component, never by client code. Owner: Nurali.
 */
import "server-only";
import { computeMonthlyBalance } from "@/lib/money";
import { DEMO_MEMBERS, DEMO_WORKSPACE, buildDemoEntries } from "@/server/seed/demo-family";
import type { Entry, ExpenseEntry, Member, MemberBalance, TimeEntry } from "@/shared/domain";

export interface LandingMember {
  name: string;
  role: Member["role"];
  paidCents: number;
  minutes: number;
  suggestedContributionCents: number;
}

export interface LandingData {
  month: Date;
  totalOutOfPocketCents: number;
  members: LandingMember[];
  caregiver: LandingMember;
  /** The sibling whose invoice the hero shows (Mike). */
  sibling: LandingMember;
  /** First pharmacy receipt, first appointment drive, and the sibling's own purchase. */
  pharmacy: ExpenseEntry;
  appointment: TimeEntry;
  siblingPurchase: ExpenseEntry;
}

const CREATED_AT = "2026-01-01T00:00:00.000Z";

function toMember(b: MemberBalance): LandingMember {
  return {
    name: b.name,
    role: b.role,
    paidCents: b.paidCents,
    minutes: b.minutes,
    suggestedContributionCents: b.suggestedContributionCents,
  };
}

function must<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new Error(`demo seed is missing ${what}`);
  return value;
}

export function landingData(today: Date = new Date()): LandingData {
  const members: Member[] = DEMO_MEMBERS.map((m, position) => ({
    id: m.key,
    name: m.name,
    role: m.role,
    position,
  }));
  const ids = { sarah: "sarah", mike: "mike", emily: "emily" };
  const entries: Entry[] = buildDemoEntries(today, ids).map((e, i) => ({
    ...e,
    id: `demo-${i}`,
    createdAt: CREATED_AT,
  })) as Entry[];
  const month = entries[0].date.slice(0, 7);
  const balance = computeMonthlyBalance({
    month,
    members,
    entries,
    hourlyRateCents: DEMO_WORKSPACE.hourlyRateCents,
  });
  const all = balance.members.map(toMember);
  const expenses = entries.filter((e): e is ExpenseEntry => e.kind === "expense");
  const times = entries.filter((e): e is TimeEntry => e.kind === "time");
  return {
    month: new Date(`${month}-01T00:00:00Z`),
    totalOutOfPocketCents: balance.totalOutOfPocketCents,
    members: all,
    caregiver: must(
      all.find((m) => m.role === "caregiver"),
      "a caregiver",
    ),
    sibling: must(
      all.find((m) => m.name === "Mike"),
      "Mike",
    ),
    pharmacy: must(
      expenses.find((e) => e.category === "medication"),
      "a pharmacy receipt",
    ),
    appointment: must(
      times.find((e) => e.category === "appointments"),
      "an appointment",
    ),
    siblingPurchase: must(
      expenses.find((e) => e.memberId === "mike"),
      "Mike's purchase",
    ),
  };
}
