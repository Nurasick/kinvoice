import { describe, expect, it } from "vitest";
import type { Entry, MemberBalance, PublicInvoice } from "@/shared/domain";
import { groupExpenses, initialSibling, paymentFor, payNote, timeEntries } from "./public-invoice-view";

const base = { memberId: "s", note: "", source: "manual" as const, createdAt: "2026-11-01T00:00:00.000Z" };

const ENTRIES: Entry[] = [
  { ...base, id: "1", kind: "expense", date: "2026-11-05", amountCents: 4000, category: "medical" },
  { ...base, id: "2", kind: "expense", date: "2026-11-01", amountCents: 8642, category: "medication" },
  { ...base, id: "3", kind: "time", date: "2026-11-09", minutes: 60, category: "admin" },
  { ...base, id: "4", kind: "expense", date: "2026-11-03", amountCents: 2399, category: "medication" },
  { ...base, id: "5", kind: "time", date: "2026-11-02", minutes: 180, category: "appointments" },
];

function member(id: string, role: MemberBalance["role"]): MemberBalance {
  return {
    memberId: id,
    name: id,
    role,
    paidCents: 0,
    minutes: 0,
    timeValueCents: 0,
    fairShareCents: 0,
    suggestedContributionCents: 0,
  };
}

function invoice(members: MemberBalance[]): PublicInvoice {
  return {
    parentName: "Mom",
    caregiverName: "Sarah",
    caregiverHandles: {},
    month: "2026-11",
    message: "Hi",
    entries: [],
    publishedAt: "2026-11-14T00:00:00.000Z",
    payments: [
      {
        id: "p",
        invoiceId: "i",
        memberId: "mike",
        amountCents: 100,
        method: "venmo",
        status: "sent",
        updatedAt: "2026-11-14T00:00:00.000Z",
      },
    ],
    snapshot: {
      month: "2026-11",
      totalOutOfPocketCents: 0,
      totalMinutes: 0,
      totalTimeValueCents: 0,
      hourlyRateCents: 0,
      members,
      byExpenseCategory: {},
      byTimeCategory: {},
    },
  };
}

describe("groupExpenses", () => {
  it("groups by category, biggest first, entries by date", () => {
    const groups = groupExpenses(ENTRIES);
    expect(groups.map((g) => [g.category, g.totalCents])).toEqual([
      ["medication", 11041],
      ["medical", 4000],
    ]);
    expect(groups[0].entries.map((e) => e.id)).toEqual(["2", "4"]);
  });

  it("lists time entries oldest first", () => {
    expect(timeEntries(ENTRIES).map((e) => e.id)).toEqual(["5", "3"]);
  });
});

describe("sibling selection", () => {
  const two = invoice([member("sarah", "caregiver"), member("mike", "sibling"), member("emily", "sibling")]);

  it("keeps a remembered sibling only if they are on this invoice", () => {
    expect(initialSibling(two, "emily")).toBe("emily");
    expect(initialSibling(two, "someone-else")).toBeNull();
    expect(initialSibling(two, null)).toBeNull();
  });

  it("preselects the only sibling", () => {
    expect(initialSibling(invoice([member("sarah", "caregiver"), member("mike", "sibling")]), null)).toBe(
      "mike",
    );
  });

  it("finds a sibling's payment and builds the pay note", () => {
    expect(paymentFor(two, "mike")?.status).toBe("sent");
    expect(paymentFor(two, "emily")).toBeUndefined();
    expect(payNote("Mom", "November 2026")).toBe("Mom's care, November 2026");
  });
});
