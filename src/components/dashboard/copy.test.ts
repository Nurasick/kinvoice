import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locales";
import { frameCopy } from "@/components/layout/copy";
import { dashboardCopy, dateLabel, plural } from "./copy";

const SAMPLE = {
  parent: "Mom",
  month: "M",
  name: "Mike",
  pct: 88,
  total: "$1",
  settled: 1,
  n: 2,
  date: "d",
  value: "$1",
  rate: "$25",
  title: "T",
};

/** Every leaf string, with functions called on sample values. */
function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (typeof v === "function") return [String((v as (p: typeof SAMPLE) => string)(SAMPLE))];
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

/** Dotted key paths, so a missing key in one language shows up as a diff. */
function keys(v: unknown, prefix = ""): string[] {
  if (!v || typeof v !== "object") return [prefix];
  return Object.entries(v).flatMap(([k, x]) => keys(x, prefix ? `${prefix}.${k}` : k));
}

describe.each([
  ["dashboard", dashboardCopy],
  ["app frame", frameCopy],
] as const)("%s copy", (_, copyFor) => {
  it("has the same keys in every language", () => {
    for (const locale of LOCALES) expect(keys(copyFor(locale))).toEqual(keys(copyFor("en")));
  });

  it("never says owe (or debt) in any language", () => {
    for (const locale of LOCALES) {
      expect(strings(copyFor(locale)).join(" ").toLowerCase()).not.toMatch(/\bowe|долг|должн|қарыз/);
    }
  });
});

describe("plural and dates", () => {
  const forms = { one: "запись", few: "записи", many: "записей", other: "записи" };

  it("picks Russian plural forms", () => {
    expect([1, 2, 5, 11, 21, 22].map((n) => plural("ru", n, forms))).toEqual([
      "запись",
      "записи",
      "записей",
      "записей",
      "запись",
      "записи",
    ]);
  });

  it("counts entries naturally in each language", () => {
    expect(dashboardCopy("en").progress.entries({ n: 1 })).toBe("1 entry this month");
    expect(dashboardCopy("ru").recent.logged({ n: 20 })).toBe("20 записей за месяц");
    expect(dashboardCopy("kk").recent.logged({ n: 20 })).toBe("Осы айда 20 жазба");
  });

  it("formats the sent date in the reader's language", () => {
    expect(dateLabel("2026-11-14T12:00:00.000Z", "en")).toBe("Nov 14, 2026");
    expect(dateLabel("2026-11-14T12:00:00.000Z", "ru")).toMatch(/14/);
    // Spelled out, not Intl: browsers have no Kazakh month names and would print "M11".
    expect(dateLabel("2026-11-14T12:00:00.000Z", "kk")).toBe("14 қараша 2026");
  });
});
