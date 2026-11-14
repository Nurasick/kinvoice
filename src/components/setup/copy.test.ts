import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locales";
import { setupCopy } from "./copy";
import { draftFromWorkspace, toUpdateRequest } from "./settings-draft";

const SAMPLE = { n: 2, parent: "Mom" };

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

describe("setup and settings copy", () => {
  it("has the same keys in every language", () => {
    for (const locale of LOCALES) expect(keys(setupCopy(locale))).toEqual(keys(setupCopy("en")));
  });

  it("never says owe (or debt) in any language", () => {
    for (const locale of LOCALES) {
      expect(strings(setupCopy(locale)).join(" ").toLowerCase()).not.toMatch(/\bowe|долг|должн|қарыз/);
    }
  });

  it("words every settings validation code in every language", () => {
    const workspace = {
      id: "w",
      parentName: "Mom",
      hourlyRateCents: 2500,
      currency: "USD" as const,
      caregiverHandles: {},
      isDemo: false,
      createdAt: "2026-11-01T00:00:00.000Z",
    };
    const result = toUpdateRequest({ ...draftFromWorkspace(workspace), parentName: "", hourlyRate: "500" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    for (const locale of LOCALES) {
      for (const code of Object.values(result.errors)) {
        expect(code && setupCopy(locale).errors[code]).toBeTruthy();
      }
    }
  });
});
