import { describe, expect, it } from "vitest";
import { formatDuration, monthName } from "./format";
import { decideLocale, fromAcceptLanguage, isPageLoad, resolveLocale, withLocale } from "./locales";

describe("resolveLocale", () => {
  it("prefers the URL, then the cookie, then the browser, then English", () => {
    expect(resolveLocale({ query: "ru", cookie: "kk", acceptLanguage: "en" })).toBe("ru");
    expect(resolveLocale({ cookie: "kk", acceptLanguage: "ru" })).toBe("kk");
    expect(resolveLocale({ acceptLanguage: "ru-RU,ru;q=0.9,en;q=0.8" })).toBe("ru");
    expect(resolveLocale({})).toBe("en");
  });

  it("accepts kz as Kazakh and ignores unknown values", () => {
    expect(resolveLocale({ query: "KZ" })).toBe("kk");
    expect(resolveLocale({ query: "de", cookie: "fr" })).toBe("en");
    expect(resolveLocale({ query: ["kk", "ru"] })).toBe("kk");
  });

  it("ranks Accept-Language by quality", () => {
    expect(fromAcceptLanguage("de;q=1, kk;q=0.4, ru;q=0.7")).toBe("ru");
    expect(fromAcceptLanguage("de, fr")).toBeNull();
    expect(fromAcceptLanguage(null)).toBeNull();
  });
});

describe("formatDuration", () => {
  it("formats hours and minutes per language, never breaking inside a value", () => {
    const plain = (v: string) => v.replaceAll(" ", " ");
    expect(plain(formatDuration(1005, "en"))).toBe("16h 45m");
    expect(plain(formatDuration(1005, "ru"))).toBe("16 ч 45 мин");
    expect(plain(formatDuration(180, "kk"))).toBe("3 сағ");
    expect(formatDuration(45, "en")).toBe("45m");
    expect(formatDuration(1005, "ru")).not.toContain(" ");
  });
});

describe("monthName", () => {
  it("returns a capitalised stand-alone month name", () => {
    const nov = new Date(Date.UTC(2026, 10, 14));
    expect(monthName(nov, "en")).toBe("November");
    expect(monthName(nov, "ru")).toBe("Ноябрь");
    expect(monthName(nov, "kk")).toBe("Қараша");
  });
});

describe("decideLocale", () => {
  it("persists a language chosen in the URL", () => {
    expect(decideLocale({ query: "ru", cookie: null })).toEqual({ locale: "ru", shouldPersist: true });
    expect(decideLocale({ query: "kz", cookie: "en" })).toEqual({ locale: "kk", shouldPersist: true });
  });

  it("does not rewrite the cookie when nothing new was chosen", () => {
    expect(decideLocale({ query: "ru", cookie: "ru" }).shouldPersist).toBe(false);
    expect(decideLocale({ cookie: "kk", acceptLanguage: "ru" })).toEqual({ locale: "kk", shouldPersist: false });
    expect(decideLocale({ query: "fr", acceptLanguage: "ru-RU" })).toEqual({ locale: "ru", shouldPersist: false });
  });
});

describe("prefetches never change the remembered language", () => {
  const h = (entries: Record<string, string>) => new Headers(entries);

  it("treats router prefetches and RSC fetches as not a page load", () => {
    expect(isPageLoad(h({ rsc: "1", "next-router-prefetch": "1" }))).toBe(false);
    expect(isPageLoad(h({ rsc: "1" }))).toBe(false);
    expect(isPageLoad(h({ "sec-purpose": "prefetch" }))).toBe(false);
    expect(isPageLoad(h({ "sec-fetch-dest": "empty" }))).toBe(false);
  });

  it("treats a browser opening a link as a page load", () => {
    expect(isPageLoad(h({ "sec-fetch-dest": "document" }))).toBe(true);
    expect(isPageLoad(h({}))).toBe(true);
  });

  it("does not persist ?lang from a prefetch, but does from a page load", () => {
    expect(decideLocale({ query: "kk", cookie: "en", isPageLoad: false })).toEqual({ locale: "kk", shouldPersist: false });
    expect(decideLocale({ query: "kk", cookie: "en", isPageLoad: true }).shouldPersist).toBe(true);
  });
});

describe("withLocale", () => {
  it("adds or replaces lang and keeps the other parameters", () => {
    expect(withLocale("/i/abc?for=m1", "ru")).toBe("/i/abc?for=m1&lang=ru");
    expect(withLocale("/app/invoice?month=2026-11&lang=en", "kk")).toBe("/app/invoice?month=2026-11&lang=kk");
    expect(withLocale("/", "en")).toBe("/?lang=en");
  });
});
