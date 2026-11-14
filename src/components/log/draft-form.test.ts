import { describe, expect, it } from "vitest";
import type { Entry } from "@/shared/domain";
import { changeKind, draftToForm, emptyForm, entryToForm, formToNewEntry, localToday, parseDuration } from "./draft-form";

const defaults = { today: "2026-11-14", caregiverId: "sarah", source: "quick_log" as const };

describe("draftToForm → formToNewEntry", () => {
  it("round-trips the demo expense and time drafts", () => {
    const expense = draftToForm({ kind: "expense", amountCents: 8600, category: "medication", merchant: "CVS", note: "Mom's meds" }, defaults);
    expect(expense).toMatchObject({ amount: "86", date: "2026-11-14", memberId: "sarah" });
    expect(formToNewEntry(expense)).toEqual({
      ok: true,
      entry: { kind: "expense", date: "2026-11-14", memberId: "sarah", amountCents: 8600, category: "medication", merchant: "CVS", note: "Mom's meds", source: "quick_log" },
    });

    const time = draftToForm({ kind: "time", minutes: 180, category: "appointments" }, defaults);
    expect(time).toMatchObject({ hours: "3", mins: "" });
    expect(formToNewEntry(time)).toMatchObject({ ok: true, entry: { kind: "time", minutes: 180, category: "appointments" } });
  });

  it("converts typed dollars to integer cents without float drift", () => {
    const form = { ...emptyForm("expense", defaults), amount: "$1,086.10" };
    expect(formToNewEntry(form)).toMatchObject({ ok: true, entry: { amountCents: 108610 } });
    expect(draftToForm({ kind: "expense", amountCents: 1250 }, defaults).amount).toBe("12.50");
  });

  it("reports missing amount, duration and bad dates instead of saving", () => {
    expect(formToNewEntry(emptyForm("expense", defaults))).toEqual({ ok: false, errors: { amount: expect.any(String) } });
    expect(formToNewEntry(emptyForm("time", defaults))).toEqual({ ok: false, errors: { duration: expect.any(String) } });
    expect(formToNewEntry({ ...emptyForm("expense", defaults), amount: "5", date: "" })).toMatchObject({ ok: false, errors: { date: expect.any(String) } });
    expect(formToNewEntry({ ...emptyForm("expense", defaults), amount: "-5" })).toMatchObject({ ok: false });
  });

  it("replaces a category that doesn't fit the kind", () => {
    expect(draftToForm({ kind: "time", category: "medication" }, defaults).category).toBe("other");
    const form = { ...emptyForm("expense", defaults), category: "household" };
    expect(changeKind(form, "time").category).toBe("household");
    expect(changeKind({ ...form, category: "groceries" }, "time").category).toBe("other");
  });

  it("drops an empty merchant", () => {
    const res = formToNewEntry({ ...emptyForm("expense", defaults), amount: "5", merchant: "  " });
    expect(res.ok && res.entry.kind === "expense" && res.entry.merchant).toBe(undefined);
  });
});

describe("entryToForm", () => {
  it("prefills the edit form and keeps the source", () => {
    const entry: Entry = { id: "e1", kind: "time", memberId: "mike", minutes: 45, date: "2026-11-02", category: "companionship", note: "Call", source: "manual", createdAt: "2026-11-02T00:00:00.000Z" };
    expect(entryToForm(entry)).toMatchObject({ key: "e1", memberId: "mike", hours: "", mins: "45", date: "2026-11-02", source: "manual" });
  });
});

describe("parseDuration", () => {
  it("accepts hours, decimals and minutes", () => {
    expect(parseDuration("3", "")).toBe(180);
    expect(parseDuration("1.5", "")).toBe(90);
    expect(parseDuration("", "45")).toBe(45);
    expect(parseDuration("1", "15")).toBe(75);
  });
  it("rejects zero, negative, fractional minutes and > 24h", () => {
    expect(parseDuration("", "")).toBeNull();
    expect(parseDuration("-1", "")).toBeNull();
    expect(parseDuration("", "2.5")).toBeNull();
    expect(parseDuration("25", "")).toBeNull();
  });
});

describe("localToday", () => {
  it("uses local calendar fields", () => {
    expect(localToday(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});
