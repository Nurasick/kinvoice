import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locales";
import { invoiceCopy } from "./copy";

const SAMPLE = {
  month: "M",
  date: "d",
  name: "Mike",
  paid: "$1",
  time: "1h",
  total: "$2",
  settled: 1,
  count: 2,
};

function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (typeof v === "function") return [String((v as (p: typeof SAMPLE) => string)(SAMPLE))];
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

function keys(v: unknown, prefix = ""): string[] {
  if (!v || typeof v !== "object") return [prefix];
  return Object.entries(v).flatMap(([k, x]) => keys(x, prefix ? `${prefix}.${k}` : k));
}

describe("invoice copy", () => {
  it("has the same keys in every language", () => {
    for (const locale of LOCALES) expect(keys(invoiceCopy(locale))).toEqual(keys(invoiceCopy("en")));
  });

  it("never says owe (or debt) in any language", () => {
    for (const locale of LOCALES) {
      expect(strings(invoiceCopy(locale)).join(" ").toLowerCase()).not.toMatch(/\bowe|долг|должн|қарыз/);
    }
  });

  it("uses the 'suggested contribution' wording", () => {
    expect(invoiceCopy("ru").published.suggested).toBe("Предлагаемый вклад");
    expect(invoiceCopy("kk").published.suggested).toBe("Ұсынылған үлес");
  });

  it("words the sent-invoice summary in each language", () => {
    const p = { date: "14 қараша 2026", total: "$1,015.19", settled: 1, count: 2 };
    expect(invoiceCopy("en").list.meta(p)).toBe(
      "Published 14 қараша 2026 · $1,015.19 in care costs · 1 of 2 settled",
    );
    expect(invoiceCopy("kk").list.meta(p)).toContain("1/2");
  });
});
