import { describe, expect, it } from "vitest";
import { landingData } from "./landing-data";

describe("landingData", () => {
  const d = landingData(new Date(2026, 10, 14));

  it("matches the demo family's documented month", () => {
    expect(d.totalOutOfPocketCents).toBe(101519);
    expect(d.caregiver).toMatchObject({ name: "Sarah", paidCents: 89519, minutes: 960 });
    expect(d.sibling).toMatchObject({ name: "Mike", paidCents: 12000, suggestedContributionCents: 21840 });
  });

  it("picks the hero's scraps from the real seed", () => {
    expect(d.pharmacy).toMatchObject({ amountCents: 8642, merchant: "CVS Pharmacy" });
    expect(d.appointment.minutes).toBe(180);
    expect(d.siblingPurchase.amountCents).toBe(12000);
  });

  it("keeps fair shares summing to the total", () => {
    const sibs = d.members.filter((m) => m.role === "sibling");
    expect(sibs.map((m) => m.name)).toEqual(["Mike", "Emily"]);
    expect(d.month.toISOString().slice(0, 7)).toBe("2026-11");
  });
});
