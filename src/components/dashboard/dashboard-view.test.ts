import { describe, expect, it } from "vitest";
import type { MonthlyBalance } from "@/shared/domain";
import {
  categoryRows,
  currentMonth,
  isEmptyMonth,
  orderedMembers,
  totalSuggestedCents,
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

  it("totals the suggested contributions", () => {
    expect(totalSuggestedCents(balance())).toBe(55679);
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
