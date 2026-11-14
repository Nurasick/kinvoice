import { describe, expect, it } from "vitest";
import { DraftEntry } from "@/shared/domain";
import { parseJsonSafe, salvageDraft, salvageDrafts } from "./salvage";

const ids = ["m1", "m2"];

describe("salvageDrafts", () => {
  it("keeps fully valid drafts and reports no loss", () => {
    const raw = {
      drafts: [
        { kind: "expense", date: "2026-11-14", memberId: null, amountCents: 8600, minutes: null, category: "medication", merchant: "CVS", note: "Mom's meds" },
        { kind: "time", date: "2026-11-14", memberId: null, amountCents: null, minutes: 180, category: "appointments", merchant: null, note: "Cardiologist" },
      ],
    };
    const { drafts, lossy } = salvageDrafts(raw, ids);
    expect(lossy).toBe(false);
    expect(drafts).toEqual([
      { kind: "expense", date: "2026-11-14", amountCents: 8600, category: "medication", merchant: "CVS", note: "Mom's meds" },
      { kind: "time", date: "2026-11-14", minutes: 180, category: "appointments", note: "Cardiologist" },
    ]);
    drafts.forEach((d) => expect(DraftEntry.safeParse(d).success).toBe(true));
  });

  it("drops bad fields but keeps the rest of the card", () => {
    const raw = {
      drafts: [{ kind: "expense", date: "2026-02-30", memberId: "stranger", amountCents: 86.5, category: "appointments", merchant: "CVS", note: "meds" }],
    };
    const { drafts, lossy } = salvageDrafts(raw, ids);
    expect(lossy).toBe(true);
    expect(drafts).toEqual([{ kind: "expense", merchant: "CVS", note: "meds" }]);
  });

  it("rejects negative, zero and absurd amounts and durations", () => {
    expect(salvageDraft({ kind: "expense", amountCents: -100 }, ids)).toEqual({ kind: "expense" });
    expect(salvageDraft({ kind: "expense", amountCents: 0 }, ids)).toEqual({ kind: "expense" });
    expect(salvageDraft({ kind: "expense", amountCents: 1e12 }, ids)).toEqual({ kind: "expense" });
    expect(salvageDraft({ kind: "time", minutes: 5000 }, ids)).toEqual({ kind: "time" });
  });

  it("keeps a valid member id and strips fields of the other kind", () => {
    expect(salvageDraft({ kind: "time", memberId: "m2", minutes: 45, amountCents: 900, merchant: "X" }, ids)).toEqual({
      kind: "time",
      memberId: "m2",
      minutes: 45,
    });
  });

  it("skips items that are not drafts", () => {
    const { drafts, lossy } = salvageDrafts({ drafts: ["nope", { kind: "gift" }, { kind: "time", minutes: 30 }] }, ids);
    expect(drafts).toEqual([{ kind: "time", minutes: 30 }]);
    expect(lossy).toBe(true);
  });

  it("returns nothing for garbage", () => {
    expect(salvageDrafts(null, ids)).toEqual({ drafts: [], lossy: true });
    expect(salvageDrafts({ items: [] }, ids)).toEqual({ drafts: [], lossy: true });
  });

  it("truncates over-long text instead of failing", () => {
    const draft = salvageDraft({ kind: "expense", note: "x".repeat(500), merchant: "y".repeat(100) }, ids);
    expect(draft?.note).toHaveLength(280);
    expect(draft?.merchant).toHaveLength(80);
  });

  it("can force the kind (receipts are always expenses)", () => {
    expect(salvageDraft({ amountCents: 4317, merchant: "CVS Pharmacy" }, [], "expense")).toEqual({
      kind: "expense",
      amountCents: 4317,
      merchant: "CVS Pharmacy",
    });
  });
});

describe("parseJsonSafe", () => {
  it("parses JSON and returns null for invalid input", () => {
    expect(parseJsonSafe('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonSafe("{not json")).toBeNull();
    expect(parseJsonSafe("")).toBeNull();
    expect(parseJsonSafe(null)).toBeNull();
  });
});
