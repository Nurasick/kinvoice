import { describe, expect, it } from "vitest";
import type { Entry, Member } from "@/shared/domain";
import { InvoiceTone } from "@/shared/domain";
import { computeMonthlyBalance } from "@/lib/money";
import { isSafeInvoiceMessage } from "./guard";
import { localeOf, requestLocale } from "./locale";
import { mockAi } from "./mock";
import { templateInvoiceMessage } from "./template";

const members: Member[] = [
  { id: "s", name: "Sarah", role: "caregiver" },
  { id: "m", name: "Mike", role: "sibling" },
  { id: "e", name: "Emily", role: "sibling" },
];
const entries: Entry[] = [
  { id: "1", kind: "expense", memberId: "s", amountCents: 90000, date: "2026-11-03", category: "home_care", note: "", source: "manual", createdAt: "2026-11-03T00:00:00.000Z" },
  { id: "2", kind: "time", memberId: "e", minutes: 60, date: "2026-11-04", category: "companionship", note: "", source: "manual", createdAt: "2026-11-04T00:00:00.000Z" },
];
const balance = computeMonthlyBalance({ month: "2026-11", members, entries, hourlyRateCents: 2500 });
const input = { parentName: "Mom (Linda)", caregiverName: "Sarah", balance };

describe("locale selection", () => {
  it("reads only supported locales from an input", () => {
    expect(localeOf({ locale: "kk" })).toBe("kk");
    expect(localeOf({ locale: "de" })).toBe("en");
    expect(localeOf({})).toBe("en");
  });

  it("body beats cookie beats Accept-Language", () => {
    const req = new Request("http://x", { headers: { cookie: "a=1; lang=kk", "accept-language": "ru-RU,ru;q=0.9" } });
    expect(requestLocale(req, "ru")).toBe("ru");
    expect(requestLocale(req)).toBe("kk");
    expect(requestLocale(new Request("http://x", { headers: { "accept-language": "ru-RU" } }))).toBe("ru");
    expect(requestLocale(new Request("http://x"))).toBe("en");
  });
});

describe("template in Russian and Kazakh", () => {
  it.each(InvoiceTone.options)("%s tone: native phrase, real numbers, safe", (tone) => {
    const ru = templateInvoiceMessage({ ...input, tone }, "ru");
    const kk = templateInvoiceMessage({ ...input, tone }, "kk");
    expect(ru).toContain("Предлагаемый вклад — Mike: $300.00, Emily: $300.00.");
    expect(kk).toContain("Ұсынылған үлес — Mike: $300.00, Emily: $300.00.");
    for (const message of [ru, kk]) {
      expect(message).not.toMatch(/\$0|owe/i);
      expect(isSafeInvoiceMessage(message, balance)).toBe(true);
    }
  });

  it("uses the local month name and time units", () => {
    expect(templateInvoiceMessage({ ...input, tone: "brief" }, "ru")).toMatch(/^Ноябрь, Mom \(Linda\): \$900\.00 расходов и 1\s?ч ухода\./);
    expect(templateInvoiceMessage({ ...input, tone: "direct" }, "kk")).toContain("Қараша айындағы");
  });
});

describe("guard in Russian and Kazakh", () => {
  const ok = "Mike: $300.00, Emily: $300.00.";
  it("rejects debt words but not similar harmless words", () => {
    expect(isSafeInvoiceMessage(`Ты должен. ${ok}`, balance)).toBe(false);
    expect(isSafeInvoiceMessage(`Это не долг. ${ok}`, balance)).toBe(false);
    expect(isSafeInvoiceMessage(`Сенің қарызың. ${ok}`, balance)).toBe(false);
    expect(isSafeInvoiceMessage(`Мы долго были в больнице. ${ok}`, balance)).toBe(true);
  });

  it("rejects amounts written without the $ sign", () => {
    expect(isSafeInvoiceMessage(`${ok} Всего 900 долларов.`, balance)).toBe(false);
    expect(isSafeInvoiceMessage(`${ok} Total 900.00 USD.`, balance)).toBe(false);
  });
});

describe("mock AI understands Russian and Kazakh", () => {
  it.each([
    "Заплатила $86 в CVS за мамины лекарства, потом отвезла её к кардиологу, 3 часа.",
    "Анамның дәрілері үшін CVS-те $86 төледім, содан кейін оны кардиологқа апардым, 3 сағат.",
  ])("%s", async (text) => {
    const { drafts } = await mockAi.parseQuickLog({ text, today: "2026-11-14", members });
    expect(drafts.map((d) => [d.kind, d.amountCents ?? d.minutes, d.category])).toEqual([
      ["expense", 8600, "medication"],
      ["time", 180, "appointments"],
    ]);
  });
});
