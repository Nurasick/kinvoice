import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locales";
import { categoryName, siblingCopy, type SiblingCopy } from "./copy";
import { dayLabel, monthYear } from "./public-invoice-view";

/** Every string the copy can produce, with sample values filled in. */
function allStrings(copy: SiblingCopy): string[] {
  const p = {
    month: "M",
    caregiver: "Sarah",
    parent: "Mom",
    name: "Mike",
    amount: "$1",
    handle: "h",
    rate: "$25",
    duration: "1h",
  };
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (typeof v === "function") out.push(String((v as (x: typeof p) => string)(p)));
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(copy);
  return out;
}

describe("sibling copy", () => {
  it("has the same keys and every category in all languages", () => {
    const shape = (c: SiblingCopy): string[] =>
      Object.entries(c).flatMap(([k, v]) =>
        typeof v === "string" ? [k] : Object.keys(v as object).map((x) => `${k}.${x}`),
      );
    const en = siblingCopy("en");
    for (const locale of LOCALES) {
      expect(shape(siblingCopy(locale))).toEqual(shape(en));
    }
  });

  it("never says owe (or debt) in any language", () => {
    for (const locale of LOCALES) {
      const text = allStrings(siblingCopy(locale)).join(" ").toLowerCase();
      expect(text).not.toMatch(/\bowe|долг|должн|қарыз/);
    }
  });

  it("names a category in the reader's language, falling back to Other", () => {
    expect(categoryName(siblingCopy("ru"), "medication")).toBe("Лекарства");
    expect(categoryName(siblingCopy("kk"), "groceries")).toBe("Азық-түлік");
    expect(categoryName(siblingCopy("en"), "unknown")).toBe("Other");
  });

  it("uses the 'suggested contribution' wording", () => {
    expect(siblingCopy("en").breakdown.colSuggested).toBe("Suggested contribution");
    expect(siblingCopy("ru").breakdown.colSuggested).toBe("Предлагаемый вклад");
    expect(siblingCopy("kk").breakdown.colSuggested).toBe("Ұсынылған үлес");
  });
});

describe("localized dates", () => {
  it("formats the invoice month", () => {
    expect(monthYear("2026-11", "en")).toBe("November 2026");
    expect(monthYear("2026-11", "ru")).toBe("Ноябрь 2026");
  });

  it("formats an entry day without shifting it", () => {
    expect(dayLabel("2026-11-14", "en")).toBe("Sat, Nov 14");
    expect(dayLabel("2026-11-01", "ru")).toMatch(/1/);
  });
});
