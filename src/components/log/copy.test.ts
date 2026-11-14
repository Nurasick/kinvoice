import { describe, expect, it } from "vitest";
import { ExpenseCategory, TimeCategory } from "@/shared/domain";
import { LOCALES } from "@/lib/i18n/locales";
import { logCopy } from "./copy";
import { formToNewEntry, emptyForm } from "./draft-form";
import { categoryLabel, monthLabel, shortDate } from "./labels";

/** Every string leaf, with its path, so missing or empty translations show up by name. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function") return [[path, String((value as (n: number) => string)(3))]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe("log copy", () => {
  const en = new Map(leaves(logCopy("en")));

  it.each(LOCALES)("%s has every key, none empty, no debt wording", (locale) => {
    const strings = leaves(logCopy(locale));
    expect(strings.map(([k]) => k).sort()).toEqual([...en.keys()].sort());
    for (const [key, text] of strings) {
      expect(text.trim(), key).not.toBe("");
      expect(text, key).not.toMatch(/\bowe\b|долг|должн|қарыз/i);
    }
  });

  it.each(LOCALES)("%s labels every category", (locale) => {
    for (const c of [...ExpenseCategory.options, ...TimeCategory.options]) {
      expect(logCopy(locale).categories[c], c).toBeTruthy();
    }
  });

  it("Russian plural forms for saved entries", () => {
    const saved = logCopy("ru").notice.saved;
    expect([1, 2, 5, 21].map(saved)).toEqual([
      "Сохранена 1 запись.",
      "Сохранено 2 записи.",
      "Сохранено 5 записей.",
      "Сохранена 21 запись.",
    ]);
  });

  it("validation messages follow the language", () => {
    const form = emptyForm("expense", { today: "2026-11-14", caregiverId: "s", source: "manual" });
    const result = formToNewEntry(form, logCopy("kk").errors);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.amount).toBe("Соманы енгізіңіз, мысалы 86 не 12.50");
  });

  it("dates and months in each language", () => {
    expect(shortDate("2026-11-14")).toBe("Sat, Nov 14");
    expect(monthLabel("2026-11")).toBe("November 2026");
    expect(monthLabel("2026-11", "ru")).toBe("Ноябрь 2026");
    expect(monthLabel("2026-11", "kk")).toBe("Қараша 2026");
    expect(shortDate("2026-11-14", "kk")).toBe("Сб, 14 қараша");
    expect(shortDate("2026-11-16", "kk")).toBe("Дс, 16 қараша");
    expect(categoryLabel("medication", "ru")).toBe("Лекарства");
    expect(categoryLabel("unknown_thing", "kk")).toBe("unknown_thing");
  });
});
