import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Entry, Member } from "@/shared/domain";
import { computeMonthlyBalance } from "@/lib/money";
import { createOpenAiService, receiptContent, type ResponsesClient } from "./openai";
import { templateInvoiceMessage } from "./template";
import type { InvoiceMessageInput } from "./types";

const members: Member[] = [
  { id: "sarah", name: "Sarah", role: "caregiver" },
  { id: "mike", name: "Mike", role: "sibling" },
];
const today = "2026-11-14";
const DEMO = "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours.";

type Create = ResponsesClient["responses"]["create"];

function serviceReturning(impl: Create) {
  const create = vi.fn(impl);
  return { create, ai: createOpenAiService({ client: { responses: { create } }, model: "test-model", timeoutMs: 50 }) };
}

const replyWith = (value: unknown): Create => async () => ({ output_text: typeof value === "string" ? value : JSON.stringify(value) });

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseQuickLog", () => {
  it("returns two cards for the demo sentence", async () => {
    const { ai, create } = serviceReturning(
      replyWith({
        drafts: [
          { kind: "expense", date: today, memberId: null, amountCents: 8600, minutes: null, category: "medication", merchant: "CVS", note: "Mom's meds" },
          { kind: "time", date: today, memberId: null, amountCents: null, minutes: 180, category: "appointments", merchant: null, note: "Cardiologist visit" },
        ],
      }),
    );
    const res = await ai.parseQuickLog({ text: DEMO, today, members });
    expect(res.fallback).toBe(false);
    expect(res.drafts.map((d) => [d.kind, d.amountCents ?? d.minutes, d.category])).toEqual([
      ["expense", 8600, "medication"],
      ["time", 180, "appointments"],
    ]);
    const [body, options] = create.mock.calls[0];
    expect(body.model).toBe("test-model");
    expect(body.text.format.strict).toBe(true);
    expect(options.maxRetries).toBe(0);
  });

  it("falls back on invalid JSON", async () => {
    const { ai } = serviceReturning(replyWith("{\"drafts\": [ oops"));
    expect(await ai.parseQuickLog({ text: DEMO, today, members })).toEqual({ drafts: [], fallback: true });
  });

  it("falls back with salvaged fields when the output breaks the schema", async () => {
    const { ai } = serviceReturning(replyWith({ drafts: [{ kind: "expense", amountCents: "86", merchant: "CVS" }] }));
    expect(await ai.parseQuickLog({ text: DEMO, today, members })).toEqual({
      drafts: [{ kind: "expense", merchant: "CVS" }],
      fallback: true,
    });
  });

  it("falls back instead of throwing when the API errors", async () => {
    const { ai } = serviceReturning(async () => {
      throw new Error("401 invalid api key");
    });
    expect(await ai.parseQuickLog({ text: DEMO, today, members })).toEqual({ drafts: [], fallback: true });
  });

  it("falls back on timeout (abort signal fires)", async () => {
    const { ai } = serviceReturning(
      (_body, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(signal.reason));
        }),
    );
    expect(await ai.parseQuickLog({ text: DEMO, today, members })).toEqual({ drafts: [], fallback: true });
  });

  it("marks an empty result as fallback so the manual form opens", async () => {
    const { ai } = serviceReturning(replyWith({ drafts: [] }));
    expect(await ai.parseQuickLog({ text: "hello there", today, members })).toEqual({ drafts: [], fallback: true });
  });
});

describe("extractReceipt", () => {
  const png = { bytes: new Uint8Array([1, 2, 3]), mimeType: "image/png", today };

  it("returns a prefilled expense draft", async () => {
    const { ai, create } = serviceReturning(
      replyWith({ isReceipt: true, amountCents: 4317, merchant: "CVS Pharmacy", date: "2026-11-12", category: "medication", note: "Prescription" }),
    );
    expect(await ai.extractReceipt(png)).toEqual({
      draft: { kind: "expense", amountCents: 4317, merchant: "CVS Pharmacy", date: "2026-11-12", category: "medication", note: "Prescription" },
      fallback: false,
    });
    expect(create.mock.calls[0][0].input[0].content[0]).toMatchObject({ type: "input_image", image_url: "data:image/png;base64,AQID" });
  });

  it("keeps a partial draft but flags fallback when the total is unreadable", async () => {
    const { ai } = serviceReturning(replyWith({ isReceipt: true, amountCents: null, merchant: "Kroger", date: null, category: "groceries", note: null }));
    expect(await ai.extractReceipt(png)).toEqual({ draft: { kind: "expense", merchant: "Kroger", category: "groceries" }, fallback: true });
  });

  it("returns no draft for a non-receipt or a failure", async () => {
    const notReceipt = serviceReturning(replyWith({ isReceipt: false, amountCents: null, merchant: null, date: null, category: null, note: null }));
    expect(await notReceipt.ai.extractReceipt(png)).toEqual({ draft: null, fallback: true });
    const broken = serviceReturning(replyWith("nope"));
    expect(await broken.ai.extractReceipt(png)).toEqual({ draft: null, fallback: true });
  });

  it("skips the API for HEIC and sends PDFs as files", async () => {
    const { ai, create } = serviceReturning(replyWith({}));
    expect(await ai.extractReceipt({ ...png, mimeType: "image/heic" })).toEqual({ draft: null, fallback: true });
    expect(create).not.toHaveBeenCalled();
    expect(receiptContent({ ...png, mimeType: "application/pdf" })).toMatchObject({ type: "input_file", filename: "receipt.pdf" });
  });
});

describe("draftInvoiceMessage", () => {
  const entries: Entry[] = [
    { id: "e1", kind: "expense", memberId: "sarah", amountCents: 10000, date: "2026-11-10", category: "medication", note: "", source: "manual", createdAt: "2026-11-10T00:00:00.000Z" },
  ];
  const input: InvoiceMessageInput = {
    tone: "warm",
    parentName: "Linda",
    caregiverName: "Sarah",
    balance: computeMonthlyBalance({ month: "2026-11", members, entries, hourlyRateCents: 2500 }),
  };

  it("accepts a message that only uses the computed numbers", async () => {
    const message = "Hi Mike, care for Mom cost $100.00 in November. A suggested contribution of $50.00 would help. Love, Sarah";
    const { ai } = serviceReturning(replyWith({ message }));
    expect(await ai.draftInvoiceMessage(input)).toEqual({ message, fallback: false });
  });

  it("rejects invented numbers and falls back to the template", async () => {
    const { ai } = serviceReturning(replyWith({ message: "Care cost $120.00, so please send $60." }));
    expect(await ai.draftInvoiceMessage(input)).toEqual({ message: templateInvoiceMessage(input), fallback: true });
  });

  it("rejects 'owe' language", async () => {
    const { ai } = serviceReturning(replyWith({ message: "Mike, you owe $50.00." }));
    expect((await ai.draftInvoiceMessage(input)).fallback).toBe(true);
  });

  it("falls back on API failure", async () => {
    const { ai } = serviceReturning(async () => {
      throw new Error("network down");
    });
    expect(await ai.draftInvoiceMessage(input)).toEqual({ message: templateInvoiceMessage(input), fallback: true });
  });
});
