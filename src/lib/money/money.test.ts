import { describe, expect, it } from "vitest";
import type { Entry, Member } from "@/shared/domain";
import { computeMonthlyBalance, formatCents, parseDollarsToCents, splitEqually } from ".";

const members: Member[] = [
  { id: "bro", name: "Mike", role: "sibling" },
  { id: "sarah", name: "Sarah", role: "caregiver" },
  { id: "sis", name: "Emily", role: "sibling" },
];

const createdAt = "2026-11-01T00:00:00.000Z";

function expense(id: string, memberId: string, amountCents: number, date = "2026-11-03"): Entry {
  return { id, kind: "expense", memberId, amountCents, date, category: "medication", note: "", source: "manual", createdAt };
}

function time(id: string, memberId: string, minutes: number): Entry {
  return { id, kind: "time", memberId, minutes, date: "2026-11-04", category: "appointments", note: "", source: "manual", createdAt };
}

describe("splitEqually", () => {
  it("sums exactly to the total and gives leftover cents to the first shares", () => {
    expect(splitEqually(1000, 3)).toEqual([334, 333, 333]);
    expect(splitEqually(0, 3)).toEqual([0, 0, 0]);
  });

  it("rejects non-integer cents and zero parts", () => {
    expect(() => splitEqually(10.5, 2)).toThrow(RangeError);
    expect(() => splitEqually(100, 0)).toThrow(RangeError);
  });
});

describe("computeMonthlyBalance", () => {
  it("splits out-of-pocket costs equally and suggests contributions only for siblings", () => {
    const balance = computeMonthlyBalance({
      month: "2026-11",
      members,
      hourlyRateCents: 2500,
      entries: [expense("e1", "sarah", 90000), expense("e2", "bro", 10000), time("t1", "sarah", 180)],
    });

    expect(balance.totalOutOfPocketCents).toBe(100000);
    const [sarah, mike, emily] = balance.members; // caregiver is ordered first
    expect(sarah.memberId).toBe("sarah");
    expect(sarah.fairShareCents).toBe(33334);
    expect(sarah.suggestedContributionCents).toBe(0);
    expect(mike.suggestedContributionCents).toBe(33333 - 10000);
    expect(emily.suggestedContributionCents).toBe(33333);
    expect(sarah.timeValueCents).toBe(7500); // 3h at $25, informational only
  });

  it("ignores entries from other months", () => {
    const balance = computeMonthlyBalance({
      month: "2026-11",
      members,
      hourlyRateCents: 2500,
      entries: [expense("e1", "sarah", 5000, "2026-10-31")],
    });
    expect(balance.totalOutOfPocketCents).toBe(0);
  });
});

describe("cents helpers", () => {
  it("parses and formats dollars without floats", () => {
    expect(parseDollarsToCents("$1,086.5")).toBe(108650);
    expect(parseDollarsToCents("86")).toBe(8600);
    expect(parseDollarsToCents("-3")).toBeNull();
    expect(formatCents(8650)).toBe("$86.50");
  });
});
