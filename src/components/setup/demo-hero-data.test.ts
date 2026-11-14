import { describe, expect, it } from "vitest";
import { demoHero } from "./demo-hero-data";

describe("demoHero", () => {
  it("matches the demo family's real balance on any day of the month", () => {
    for (const day of [1, 14, 28]) {
      const hero = demoHero(new Date(2026, 10, day));
      expect(hero.totalOutOfPocketCents).toBe(101519);
      expect(hero.caregiver.paidCents).toBe(89519);
      expect(hero.caregiver.minutes).toBe(960);
      expect(hero.sibling.name).toBe("Mike");
      expect(hero.sibling.suggestedContributionCents).toBe(21840);
    }
  });

  it("uses the first logged expense and time entry", () => {
    const hero = demoHero(new Date(2026, 10, 14));
    expect(hero.firstExpense.merchant).toBe("CVS Pharmacy");
    expect(hero.firstExpense.amountCents).toBe(8642);
    expect(hero.firstTime.minutes).toBe(180);
  });
});
