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

describe("isSafeInvoiceMessage", () => {
  it("rejects empty, too long and unknown amounts", () => {
    expect(isSafeInvoiceMessage("  ", balance)).toBe(false);
    expect(isSafeInvoiceMessage("a".repeat(2000), balance)).toBe(false);
    expect(isSafeInvoiceMessage("Total was $901.00", balance)).toBe(false);
    expect(isSafeInvoiceMessage("Total was $900.00, thanks!", balance)).toBe(true);
    expect(isSafeInvoiceMessage("Total was $900.", balance)).toBe(true);
  });
});
