import { describe, expect, it } from "vitest";
import { ExpenseCategory, TimeCategory } from "@/shared/domain";
import { LOCALES } from "@/lib/i18n/locales";
import { logCopy, ruPlural } from "./copy";
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

describe("drafts summary", () => {
  it("says what one note became and that only money is split", () => {
    expect(logCopy("en").drafts.summary(1, 1)).toBe(
      "We found 1 expense and 1 block of time. Money is split; time is shown but never added to anyone’s share.",
    );
    expect(logCopy("en").drafts.summary(2, 0)).toMatch(/^We found 2 expenses\. /);
    expect(logCopy("en").drafts.summary(0, 3)).toMatch(/^We found 3 blocks of time\. /);
  });

  it("uses Russian plural forms", () => {
    expect(logCopy("ru").drafts.summary(1, 2)).toMatch(/^Нашли: 1 расход и 2 записи времени\. /);
    expect(logCopy("ru").drafts.summary(5, 1)).toMatch(/^Нашли: 5 расходов и 1 запись времени\. /);
    expect(logCopy("kk").drafts.summary(1, 1)).toMatch(/^Табылды: 1 шығын және 1 уақыт жазбасы\. /);
  });
});

describe("ruPlural", () => {
  it.each([
    [1, "расход"], [2, "расхода"], [4, "расхода"], [5, "расходов"], [11, "расходов"],
    [12, "расходов"], [21, "расход"], [22, "расхода"], [111, "расходов"],
  ])("%i → %s", (n, word) => {
    expect(ruPlural(n as number, "расход", "расхода", "расходов")).toBe(word);
  });
});
