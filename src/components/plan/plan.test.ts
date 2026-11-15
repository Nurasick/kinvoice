import { describe, expect, it } from "vitest";
import { monthlyReminderIcs, nextFirstOfMonth, nextMonth, TRIAL_DAYS, trialDaysLeft } from "./plan";

describe("trialDaysLeft", () => {
  it("gives the full free month on the day the family is created", () => {
    expect(trialDaysLeft("2026-11-15T08:00:00.000Z", new Date("2026-11-15T10:00:00.000Z"))).toBe(TRIAL_DAYS);
  });

  it("counts down by whole days and never goes below zero", () => {
    expect(trialDaysLeft("2026-11-01T00:00:00.000Z", new Date("2026-11-11T00:00:00.000Z"))).toBe(20);
    expect(trialDaysLeft("2026-09-01T00:00:00.000Z", new Date("2026-11-15T00:00:00.000Z"))).toBe(0);
  });

  it("falls back to the full month for an unreadable date", () => {
    expect(trialDaysLeft("not a date", new Date())).toBe(TRIAL_DAYS);
  });
});

describe("nextMonth / nextFirstOfMonth", () => {
  it("rolls over the year", () => {
    expect(nextMonth("2026-11")).toBe("2026-12");
    expect(nextMonth("2026-12")).toBe("2027-01");
    expect(nextFirstOfMonth(new Date(2026, 11, 20))).toBe("20270101");
  });
});

describe("monthlyReminderIcs", () => {
  const ics = monthlyReminderIcs({
    title: "Send Mom’s care invoice",
    description: "Review the month, then send one link; siblings pay in one tap.",
    url: "https://kinvoice-taupe.vercel.app/app",
    startDate: "20261201",
    uid: "reminder-1@kinvoice",
    now: new Date("2026-11-15T09:00:00.000Z"),
  });

  it("repeats on the 1st of every month as an all-day event", () => {
    expect(ics).toContain("RRULE:FREQ=MONTHLY;BYMONTHDAY=1");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261201");
    expect(ics).toContain("DTEND;VALUE=DATE:20261202");
    expect(ics).toContain("DTSTAMP:20261115T090000Z");
  });

  it("escapes commas and semicolons and uses CRLF line endings", () => {
    expect(ics.replace(/\r\n /g, "")).toContain("then send one link\\; siblings pay in one tap.");
    expect(ics.split("\r\n").every((l) => new TextEncoder().encode(l).length <= 75)).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("folds long Cyrillic lines without breaking characters", () => {
    const ru = monthlyReminderIcs({
      title: "Отправить счёт за уход за мамой",
      description: "Проверьте месяц и отправьте одну ссылку. Братья и сёстры переводят свою часть в одно касание.",
      url: "https://kinvoice-taupe.vercel.app/app",
      startDate: "20261201",
      uid: "r@kinvoice",
      now: new Date("2026-11-15T09:00:00.000Z"),
    });
    const unfolded = ru.replace(/\r\n /g, "");
    expect(unfolded).toContain("Братья и сёстры переводят свою часть в одно касание.");
    expect(ru.split("\r\n").every((l) => new TextEncoder().encode(l).length <= 75)).toBe(true);
  });

  it("never puts a private edit key in the calendar", () => {
    expect(ics).not.toMatch(/\/w\//);
  });
});
