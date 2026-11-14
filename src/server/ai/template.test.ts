import { describe, expect, it } from "vitest";
import type { Entry, Member } from "@/shared/domain";
import { computeMonthlyBalance } from "@/lib/money";
import { isSafeInvoiceMessage } from "./guard";
import { monthName, templateInvoiceMessage } from "./template";
import { InvoiceTone } from "@/shared/domain";

const members: Member[] = [
  { id: "s", name: "Sarah", role: "caregiver" },
  { id: "m", name: "Mike", role: "sibling" },
  { id: "e", name: "Emily", role: "sibling" },
];
const entries: Entry[] = [
  { id: "1", kind: "expense", memberId: "s", amountCents: 90000, date: "2026-11-03", category: "home_care", note: "", source: "manual", createdAt: "2026-11-03T00:00:00.000Z" },
  { id: "2", kind: "time", memberId: "s", minutes: 180, date: "2026-11-04", category: "appointments", note: "", source: "manual", createdAt: "2026-11-04T00:00:00.000Z" },
];
const balance = computeMonthlyBalance({ month: "2026-11", members, entries, hourlyRateCents: 2500 });

describe("templateInvoiceMessage", () => {
  it.each(InvoiceTone.options)("%s tone uses only computed numbers and never says owe", (tone) => {
    const message = templateInvoiceMessage({ tone, parentName: "Linda", caregiverName: "Sarah", balance });
    expect(message).toContain("$900.00");
    expect(message).toContain("Mike: $300.00");
    expect(message).toMatch(/suggested contribution/i);
    expect(message).not.toMatch(/\bowe\b/i);
    expect(isSafeInvoiceMessage(message, balance)).toBe(true);
  });

  it("greets siblings by name", () => {
    expect(templateInvoiceMessage({ tone: "warm", parentName: "Linda", caregiverName: "Sarah", balance })).toMatch(/^Hi Mike and Emily,/);
  });

  it("formats month names", () => {
    expect(monthName("2026-11")).toBe("November");
    expect(monthName("2027-01")).toBe("January");
  });
});

// Demo-family shape: Mike paid something, Emily paid nothing but gave time.
const unevenEntries: Entry[] = [
  ...entries,
  { id: "3", kind: "expense", memberId: "m", amountCents: 12000, date: "2026-11-05", category: "household", note: "", source: "manual", createdAt: "2026-11-05T00:00:00.000Z" },
  { id: "4", kind: "time", memberId: "e", minutes: 60, date: "2026-11-06", category: "companionship", note: "", source: "manual", createdAt: "2026-11-06T00:00:00.000Z" },
];
const uneven = computeMonthlyBalance({ month: "2026-11", members, entries: unevenEntries, hourlyRateCents: 2500 });
const emptyMonth = computeMonthlyBalance({ month: "2026-11", members, entries: [], hourlyRateCents: 2500 });

describe("templateInvoiceMessage never says $0.00", () => {
  it.each(InvoiceTone.options)("%s tone, sibling who paid nothing", (tone) => {
    const message = templateInvoiceMessage({ tone, parentName: "Linda", caregiverName: "Sarah", balance: uneven });
    expect(message).not.toMatch(/\$0(\.00)?\b/);
    expect(isSafeInvoiceMessage(message, uneven)).toBe(true);
  });

  it.each(InvoiceTone.options)("%s tone, empty month", (tone) => {
    const message = templateInvoiceMessage({ tone, parentName: "Linda", caregiverName: "Sarah", balance: emptyMonth });
    expect(message).not.toMatch(/\$0|0m/);
    expect(message).toContain("No contributions are suggested this month.");
  });
});

describe("isSafeInvoiceMessage", () => {
  const both = "Mike: $300.00, Emily: $300.00.";

  it("rejects empty, too long and unknown amounts", () => {
    expect(isSafeInvoiceMessage("  ", balance)).toBe(false);
    expect(isSafeInvoiceMessage("a".repeat(2000), balance)).toBe(false);
    expect(isSafeInvoiceMessage(`Total was $901.00. ${both}`, balance)).toBe(false);
    expect(isSafeInvoiceMessage(`Total was $900.00, thanks! ${both}`, balance)).toBe(true);
    expect(isSafeInvoiceMessage(`Total was $900. ${both}`, balance)).toBe(true);
  });

  it("requires every suggested contribution exactly once", () => {
    const [mike, emily] = uneven.members.filter((m) => m.role === "sibling").map((m) => m.suggestedContributionCents);
    const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
    expect(isSafeInvoiceMessage(`Mike ${fmt(mike)}, Emily ${fmt(emily)}.`, uneven)).toBe(true);
    expect(isSafeInvoiceMessage(`Mike ${fmt(mike)}.`, uneven)).toBe(false);
    expect(isSafeInvoiceMessage(`Mike ${fmt(mike)}, Emily ${fmt(emily)}. Again: ${fmt(mike)}`, uneven)).toBe(false);
  });

  it("rejects $0.00 even though it is a real number", () => {
    const [mike, emily] = uneven.members.filter((m) => m.role === "sibling").map((m) => m.suggestedContributionCents);
    const ok = `Mike $${(mike / 100).toFixed(2)}, Emily $${(emily / 100).toFixed(2)}.`;
    expect(isSafeInvoiceMessage(`${ok} Emily contributed $0.00.`, uneven)).toBe(false);
  });
});
