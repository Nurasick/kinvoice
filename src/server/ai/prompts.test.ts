import { describe, expect, it } from "vitest";
import type { Entry, Member } from "@/shared/domain";
import { computeMonthlyBalance } from "@/lib/money";
import { invoiceInstructions, quickLogInstructions, receiptInstructions } from "./prompts";

const members: Member[] = [
  { id: "s", name: "Sarah", role: "caregiver" },
  { id: "m", name: "Mike", role: "sibling" },
];
const entries: Entry[] = [
  { id: "1", kind: "expense", memberId: "s", amountCents: 90000, date: "2026-11-03", category: "home_care", note: "", source: "manual", createdAt: "2026-11-03T00:00:00.000Z" },
];
const balance = computeMonthlyBalance({ month: "2026-11", members, entries, hourlyRateCents: 2500 });

describe("prompts", () => {
  it("quick log lists every member id and today's date", () => {
    const text = quickLogInstructions("2026-11-14", members);
    expect(text).toContain('memberId "s"');
    expect(text).toContain('memberId "m"');
    expect(text).toContain("Today is 2026-11-14");
  });

  it("receipt merchant is a business name, never an address; total beats copay", () => {
    const text = receiptInstructions("2026-11-14");
    expect(text).toMatch(/Never an address/);
    expect(text).toMatch(/TOTAL actually charged wins/);
  });

  it("receipt and quick log steer pharmacy purchases to medication", () => {
    expect(receiptInstructions("2026-11-14")).toMatch(/Pharmacy.*→ medication/);
    expect(quickLogInstructions("2026-11-14", members)).toMatch(/home_care is ONLY paid caregivers/);
  });

  it("invoice facts come pre-formatted from lib/money and forbid owe wording", () => {
    const text = invoiceInstructions({ tone: "warm", parentName: "Linda", caregiverName: "Sarah", balance });
    expect(text).toContain("$900.00");
    expect(text).toContain("suggested contribution $450.00");
    expect(text).toMatch(/Never use the words 'owe'/);
    expect(text).toMatch(/never copy their labels/);
  });

  it("invoice facts never contain a zero amount", () => {
    const text = invoiceInstructions({ tone: "brief", parentName: "Linda", caregiverName: "Sarah", balance });
    const facts = text.split("Facts:")[1];
    expect(facts).not.toContain("$0.00");
    expect(facts).toContain("Mike (sibling): suggested contribution $450.00");
    expect(text).toMatch(/Never write \$0\.00/);
  });
});
