import { describe, expect, it } from "vitest";
import type { Entry, Member } from "@/shared/domain";
import { computeMonthlyBalance, formatMinutes, parseDollarsToCents, splitEqually, timeValueCents } from ".";

const createdAt = "2026-11-01T00:00:00.000Z";
const caregiver: Member = { id: "c", name: "Sarah", role: "caregiver" };
const sib = (id: string): Member => ({ id, name: id, role: "sibling" });

function expense(memberId: string, amountCents: number, category: "medication" | "groceries" = "medication"): Entry {
  return { id: `${memberId}-${amountCents}`, kind: "expense", memberId, amountCents, date: "2026-11-10", category, note: "", source: "manual", createdAt };
}

function balanceOf(members: Member[], entries: Entry[]) {
  return computeMonthlyBalance({ month: "2026-11", members, entries, hourlyRateCents: 2500 });
}

describe("computeMonthlyBalance edge cases", () => {
  it("returns zeros for an empty month", () => {
    const b = balanceOf([caregiver, sib("m")], []);
    expect(b.totalOutOfPocketCents).toBe(0);
    expect(b.members.every((m) => m.suggestedContributionCents === 0)).toBe(true);
    expect(b.byExpenseCategory).toEqual({});
  });

  it("never suggests a contribution to a sibling who already paid more than their share", () => {
    const b = balanceOf([caregiver, sib("m")], [expense("c", 1000), expense("m", 9000)]);
    const mike = b.members.find((m) => m.memberId === "m");
    expect(mike?.fairShareCents).toBe(5000);
    expect(mike?.suggestedContributionCents).toBe(0);
  });

  it("works for a single-sibling family and keeps shares summing to the total", () => {
    const b = balanceOf([caregiver, sib("m")], [expense("c", 10001)]);
    expect(b.members.map((m) => m.fairShareCents)).toEqual([5001, 5000]);
    expect(b.members[1].suggestedContributionCents).toBe(5000);
  });

  it("shares always sum exactly to the total for awkward amounts", () => {
    for (const total of [1, 2, 99, 100, 101, 12345, 99999]) {
      for (let n = 1; n <= 7; n++) {
        expect(splitEqually(total, n).reduce((a, b) => a + b, 0)).toBe(total);
      }
    }
  });

  it("totals categories and time separately from money", () => {
    const time: Entry = { id: "t", kind: "time", memberId: "c", minutes: 90, date: "2026-11-11", category: "errands", note: "", source: "manual", createdAt };
    const b = balanceOf([caregiver, sib("m")], [expense("c", 500, "groceries"), expense("c", 700, "groceries"), time]);
    expect(b.byExpenseCategory).toEqual({ groceries: 1200 });
    expect(b.byTimeCategory).toEqual({ errands: 90 });
    expect(b.totalTimeValueCents).toBe(3750);
    expect(b.totalOutOfPocketCents).toBe(1200); // time value is not added to money
  });

  it("ignores entries from members that are not in the family list", () => {
    const b = balanceOf([caregiver, sib("m")], [expense("ghost", 5000)]);
    expect(b.members.reduce((a, m) => a + m.paidCents, 0)).toBe(0);
    expect(b.totalOutOfPocketCents).toBe(0);
  });
});

describe("helpers", () => {
  it("formats minutes", () => {
    expect(formatMinutes(45)).toBe("45m");
    expect(formatMinutes(120)).toBe("2h");
    expect(formatMinutes(150)).toBe("2h 30m");
  });

  it("values time with half-up rounding", () => {
    expect(timeValueCents(1, 2500)).toBe(42); // 41.67 → 42
    expect(timeValueCents(0, 2500)).toBe(0);
  });

  it("rejects malformed amounts", () => {
    for (const bad of ["", "abc", "1.234", "1,2.3.4", "$"]) expect(parseDollarsToCents(bad)).toBeNull();
    expect(parseDollarsToCents(" $0.5 ")).toBe(50);
  });
});
