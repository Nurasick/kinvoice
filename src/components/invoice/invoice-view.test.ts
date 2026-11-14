import { describe, expect, it } from "vitest";
import type { Invoice, MemberBalance, PaymentMark } from "@/shared/domain";
import { publicInvoiceUrl, settledCount, siblingRows, sortInvoices } from "./invoice-view";

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

function payment(memberId: string, status: PaymentMark["status"]): PaymentMark {
  return {
    id: `p-${memberId}`,
    invoiceId: "inv",
    memberId,
    amountCents: 5000,
    method: "venmo",
    status,
    updatedAt: "2026-11-14T10:00:00.000Z",
  };
}

function invoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: "inv",
    month: "2026-11",
    publicToken: "t".repeat(32),
    tone: "warm",
    message: "Hi",
    publishedAt: "2026-11-14T10:00:00.000Z",
    snapshot: {
      month: "2026-11",
      totalOutOfPocketCents: 0,
      totalMinutes: 0,
      totalTimeValueCents: 0,
      hourlyRateCents: 2500,
      members: [
        member("sarah", "caregiver", 0),
        member("mike", "sibling", 21840),
        member("emily", "sibling", 33839),
        member("ann", "sibling", 0),
      ],
      byExpenseCategory: {},
      byTimeCategory: {},
    },
    payments: [],
    ...overrides,
  };
}

describe("siblingRows", () => {
  it("lists siblings only, with waiting / covered when nothing was reported", () => {
    const rows = siblingRows(invoice());
    expect(rows.map((r) => [r.member.name, r.status, r.amountCents, r.method])).toEqual([
      ["mike", "waiting", 21840, "other"],
      ["emily", "waiting", 33839, "other"],
      ["ann", "covered", 0, "other"],
    ]);
  });

  it("uses the reported payment for status, amount and method", () => {
    const rows = siblingRows(invoice({ payments: [payment("mike", "sent"), payment("emily", "received")] }));
    expect(rows.map((r) => [r.status, r.amountCents, r.method])).toEqual([
      ["sent", 5000, "venmo"],
      ["received", 5000, "venmo"],
      ["covered", 0, "other"],
    ]);
    expect(settledCount(rows)).toBe(2);
  });
});

describe("helpers", () => {
  it("builds the public link", () => {
    expect(publicInvoiceUrl("https://kinvoice.app", "abc")).toBe("https://kinvoice.app/i/abc");
  });

  it("sorts newest month first, then newest publish", () => {
    const a = invoice({ id: "a", month: "2026-10" });
    const b = invoice({ id: "b", month: "2026-11", publishedAt: "2026-11-01T00:00:00.000Z" });
    const c = invoice({ id: "c", month: "2026-11", publishedAt: "2026-11-20T00:00:00.000Z" });
    expect(sortInvoices([a, b, c]).map((i) => i.id)).toEqual(["c", "b", "a"]);
  });
});
