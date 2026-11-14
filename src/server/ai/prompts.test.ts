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

  it("notes: text's language first, the app's language breaks ties; receipts use the app's language", () => {
    expect(quickLogInstructions("2026-11-14", members)).not.toMatch(/the app's language/);
    expect(quickLogInstructions("2026-11-14", members, "kk")).toMatch(/unclear or mixed, use Kazakh \(the app's language\)/);
    expect(receiptInstructions("2026-11-14", "ru")).toMatch(/Write the note in Russian\./);
    expect(receiptInstructions("2026-11-14")).toMatch(/Write the note in English\./);
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

  it("Russian and Kazakh facts use native time units; names stay in Latin letters", () => {
    const withTime = computeMonthlyBalance({
      month: "2026-11",
      members,
      entries: [...entries, { id: "2", kind: "time", memberId: "m", minutes: 105, date: "2026-11-04", category: "companionship", note: "", source: "manual", createdAt: "2026-11-04T00:00:00.000Z" }],
      hourlyRateCents: 2500,
    });
    const input = { tone: "warm" as const, parentName: "Mom (Linda)", caregiverName: "Sarah", balance: withTime };
    const ru = invoiceInstructions(input, "ru").split("Facts:")[1];
    const kk = invoiceInstructions(input, "kk").split("Facts:")[1];
    expect(ru).toMatch(/gave 1\s?ч\s?45\s?мин of care/);
    expect(kk).toMatch(/gave 1\s?сағ\s?45\s?мин of care/);
    expect(ru).not.toMatch(/\d+h|\d+m\b/);
    expect(invoiceInstructions(input, "ru")).toMatch(/Latin letters \(Mike, not Майк/);
    expect(invoiceInstructions(input, "en").split("Facts:")[1]).toContain("gave 1h 45m of care");
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
