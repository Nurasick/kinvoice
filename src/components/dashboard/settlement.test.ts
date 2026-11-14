import { describe, expect, it } from "vitest";
import type { Invoice, MemberBalance, MonthlyBalance, PaymentMark } from "@/shared/domain";
import { rowFor, settlement } from "./settlement";

function member(id: string, role: MemberBalance["role"], over: Partial<MemberBalance> = {}): MemberBalance {
  return {
    memberId: id,
    name: id,
    role,
    paidCents: 0,
    minutes: 0,
    timeValueCents: 0,
    fairShareCents: 0,
    suggestedContributionCents: 0,
    ...over,
  };
}

function balance(over: Partial<MonthlyBalance> = {}): MonthlyBalance {
  return {
    month: "2026-11",
    totalOutOfPocketCents: 101519,
    totalMinutes: 1065,
    totalTimeValueCents: 44375,
    hourlyRateCents: 2500,
    members: [
      member("Sarah", "caregiver", { paidCents: 89519, minutes: 960 }),
      member("Mike", "sibling", { paidCents: 12000, minutes: 45, suggestedContributionCents: 21840 }),
      member("Emily", "sibling", { minutes: 60, suggestedContributionCents: 33839 }),
    ],
    byExpenseCategory: {},
    byTimeCategory: {},
    ...over,
  };
}

function mark(memberId: string, status: PaymentMark["status"], amountCents: number): PaymentMark {
  return { id: `p-${memberId}`, invoiceId: "inv", memberId, amountCents, method: "venmo", status, updatedAt: "2026-11-14T10:00:00.000Z" };
}

function invoice(payments: PaymentMark[], snapshot: MonthlyBalance = balance()): Invoice {
  return {
    id: "inv",
    month: "2026-11",
    publicToken: "t".repeat(32),
    tone: "warm",
    message: "Hi",
    publishedAt: "2026-11-14T09:00:00.000Z",
    snapshot,
    payments,
  };
}

describe("settlement", () => {
  it("is null before any invoice is sent", () => {
    expect(settlement(null, balance())).toBeNull();
  });

  it("counts what is still to come and what has arrived, from the invoice snapshot", () => {
    const s = settlement(invoice([mark("Mike", "received", 21840), mark("Emily", "sent", 33839)]), balance());
    expect(s).toMatchObject({ stillToComeCents: 33839, receivedCents: 21840, isAllSettled: false, hasNewCosts: false });
    expect(rowFor(s, "Mike")?.status).toBe("received");
    expect(rowFor(s, "Sarah")).toBeUndefined();
  });

  it("is all settled once every sibling is received, so nothing reads as still owed", () => {
    const s = settlement(invoice([mark("Mike", "received", 21840), mark("Emily", "received", 33839)]), balance());
    expect(s).toMatchObject({ stillToComeCents: 0, receivedCents: 55679, isAllSettled: true });
  });

  it("flags costs logged after the invoice went out", () => {
    const s = settlement(invoice([]), balance({ totalOutOfPocketCents: 110119 }));
    expect(s?.hasNewCosts).toBe(true);
  });
});
