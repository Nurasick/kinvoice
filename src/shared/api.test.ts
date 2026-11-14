import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/locales";
import { InvoiceMessageRequest, QuickLogRequest, UiLocale } from "./api";

describe("UiLocale", () => {
  it("matches the app's supported locales", () => {
    expect(UiLocale.options).toEqual([...LOCALES]);
  });
});

describe("AI requests accept an optional locale", () => {
  it("still accepts old clients that send no locale", () => {
    expect(QuickLogRequest.safeParse({ text: "Paid $5", today: "2026-11-14" }).success).toBe(true);
    expect(InvoiceMessageRequest.safeParse({ month: "2026-11", tone: "warm" }).success).toBe(true);
  });

  it("accepts a supported locale and rejects anything else", () => {
    expect(InvoiceMessageRequest.parse({ month: "2026-11", tone: "warm", locale: "kk" }).locale).toBe("kk");
    expect(QuickLogRequest.safeParse({ text: "Paid $5", today: "2026-11-14", locale: "fr" }).success).toBe(false);
  });
});
