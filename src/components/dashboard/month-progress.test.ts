import { describe, expect, it } from "vitest";
import type { Invoice, MemberBalance, PaymentMark } from "@/shared/domain";
import { latestInvoice, monthProgress } from "./month-progress";

function member(id: string, role: MemberBalance["role"], suggested: number): MemberBalance {
  return {
    memberId: id,
    name: id,
    role,
    paidCents: 0,
    minutes: 0,
    timeValueCents: 0,
    fairShareCents: 0,
    suggestedContributionCents: suggested,
  };
}

function mark(memberId: string, status: PaymentMark["status"]): PaymentMark {
  return {
    id: `p-${memberId}`,
    invoiceId: "inv",
    memberId,
    amountCents: 100,
    method: "venmo",
    status,
    updatedAt: "2026-11-14T10:00:00.000Z",
  };
}

function invoice(id: string, publishedAt: string, payments: PaymentMark[] = [], month = "2026-11"): Invoice {
  return {
    id,
    month,
    publicToken: "t".repeat(32),
    tone: "warm",
    message: "Hi",
    publishedAt,
    snapshot: {
      month,
      totalOutOfPocketCents: 1000,
      totalMinutes: 0,
      totalTimeValueCents: 0,
      hourlyRateCents: 2500,
      members: [
        member("sarah", "caregiver", 0),
        member("mike", "sibling", 300),
        member("emily", "sibling", 300),
      ],
      byExpenseCategory: {},
      byTimeCategory: {},
    },
    payments,
  };
}

describe("monthProgress", () => {
  it("asks to log first in an empty month", () => {
    const p = monthProgress(0, [], "2026-11");
    expect(p.next).toBe("log");
    expect([p.logged.state, p.sent.state, p.settled.state]).toEqual(["current", "upcoming", "upcoming"]);
  });

  it("asks to send once something is logged", () => {
    const p = monthProgress(5, [], "2026-11");
    expect(p.next).toBe("send");
    expect(p.sent.state).toBe("current");
  });

  it("follows up until every sibling is received or covered", () => {
    const p = monthProgress(5, [invoice("a", "2026-11-10T00:00:00Z", [mark("mike", "sent")])], "2026-11");
    expect(p.next).toBe("follow-up");
    expect(p.settled).toMatchObject({ state: "current", settled: 0, total: 2 });
    expect(p.settled.rows.map((r) => r.status)).toEqual(["sent", "waiting"]);
  });

  it("is done when all siblings are settled", () => {
    const paid = [mark("mike", "received"), mark("emily", "received")];
    const p = monthProgress(5, [invoice("a", "2026-11-10T00:00:00Z", paid)], "2026-11");
    expect(p.next).toBe("done");
    expect(p.settled.state).toBe("done");
  });

  it("uses the latest invoice of the month only", () => {
    const list = [
      invoice("old", "2026-11-01T00:00:00Z"),
      invoice("new", "2026-11-12T00:00:00Z"),
      invoice("oct", "2026-11-20T00:00:00Z", [], "2026-10"),
    ];
    expect(latestInvoice(list, "2026-11")?.id).toBe("new");
    expect(latestInvoice(list, "2026-09")).toBeNull();
  });
});
