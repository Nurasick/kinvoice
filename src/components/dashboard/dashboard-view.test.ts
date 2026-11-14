import { describe, expect, it } from "vitest";
import type { MonthlyBalance } from "@/shared/domain";
import {
  categoryRows,
  leadPayer,
  memberMeters,
  suggestedSiblings,
  currentMonth,
  isEmptyMonth,
  orderedMembers,
} from "./dashboard-view";

function balance(overrides: Partial<MonthlyBalance> = {}): MonthlyBalance {
  const member = {
    paidCents: 0,
    minutes: 0,
    timeValueCents: 0,
    fairShareCents: 0,
    suggestedContributionCents: 0,
  };
  return {
    month: "2026-11",
    totalOutOfPocketCents: 0,
    totalMinutes: 0,
    totalTimeValueCents: 0,
    hourlyRateCents: 2500,
    members: [
      { ...member, memberId: "m", name: "Mike", role: "sibling", suggestedContributionCents: 21840 },
      { ...member, memberId: "s", name: "Sarah", role: "caregiver" },
      { ...member, memberId: "e", name: "Emily", role: "sibling", suggestedContributionCents: 33839 },
    ],
    byExpenseCategory: {},
    byTimeCategory: {},
    ...overrides,
  };
}

describe("categoryRows", () => {
  it("drops zero rows, sorts largest first and sizes bars to the largest", () => {
    const rows = categoryRows({ groceries: 2000, medication: 8000, other: 0, transport: 4000 });
    expect(rows.map((r) => r.category)).toEqual(["medication", "transport", "groceries"]);
    expect(rows.map((r) => r.barFraction)).toEqual([1, 0.5, 0.25]);
  });

  it("breaks ties by name and handles an empty record", () => {
    expect(categoryRows({ b: 5, a: 5 }).map((r) => r.category)).toEqual(["a", "b"]);
    expect(categoryRows({})).toEqual([]);
  });
});

describe("members", () => {
  it("puts the caregiver first and keeps sibling order", () => {
    expect(orderedMembers(balance()).map((m) => m.name)).toEqual(["Sarah", "Mike", "Emily"]);
  });
});

describe("month helpers", () => {
  it("detects an empty month", () => {
    expect(isEmptyMonth(balance())).toBe(true);
    expect(isEmptyMonth(balance({ totalMinutes: 30 }))).toBe(false);
  });

  it("formats the local month with padding", () => {
    expect(currentMonth(new Date(2026, 0, 31))).toBe("2026-01");
  });
});

describe("clarity helpers", () => {
  const full = balance({
    totalOutOfPocketCents: 101519,
    totalMinutes: 1065,
    members: [
      {
        memberId: "s",
        name: "Sarah",
        role: "caregiver",
        paidCents: 89519,
        minutes: 960,
        timeValueCents: 0,
        fairShareCents: 33840,
        suggestedContributionCents: 0,
      },
      {
        memberId: "m",
        name: "Mike",
        role: "sibling",
        paidCents: 12000,
        minutes: 45,
        timeValueCents: 0,
        fairShareCents: 33840,
        suggestedContributionCents: 21840,
      },
      {
        memberId: "e",
        name: "Emily",
        role: "sibling",
        paidCents: 0,
        minutes: 60,
        timeValueCents: 0,
        fairShareCents: 33839,
        suggestedContributionCents: 33839,
      },
    ],
  });

  it("names the lead payer and their rounded share", () => {
    expect(leadPayer(full)).toEqual({ name: "Sarah", role: "caregiver", sharePct: 88 });
    expect(leadPayer(balance())).toBeNull();
  });

  it("sizes every member's bars against the month totals", () => {
    const rows = memberMeters(full);
    expect(rows.map((r) => r.member.name)).toEqual(["Sarah", "Mike", "Emily"]);
    expect(rows[0].moneyFraction).toBeCloseTo(0.8818, 3);
    expect(rows[2].moneyFraction).toBe(0);
    expect(rows[1].timeFraction).toBeCloseTo(45 / 1065, 5);
    expect(memberMeters(balance()).every((r) => r.moneyFraction === 0 && r.timeFraction === 0)).toBe(true);
  });

  it("lists only siblings with a suggested contribution", () => {
    expect(suggestedSiblings(full).map((m) => m.name)).toEqual(["Mike", "Emily"]);
  });
});
