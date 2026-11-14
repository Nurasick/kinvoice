import { describe, expect, it } from "vitest";
import { emptyDraft, toCreateRequest, type SetupDraft } from "./setup-draft";

function draft(overrides: Partial<SetupDraft> = {}): SetupDraft {
  return {
    ...emptyDraft(),
    parentName: "Linda",
    caregiverName: "Sarah",
    siblings: [
      { name: "Mike", email: "" },
      { name: "Emily", email: "emily@example.com" },
    ],
    ...overrides,
  };
}

describe("toCreateRequest", () => {
  it("builds a valid request with the default $25/h rate", () => {
    const result = toCreateRequest(draft({ venmo: "@sarah-k" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.request.hourlyRateCents).toBe(2500);
    expect(result.request.siblings).toEqual([
      { name: "Mike" },
      { name: "Emily", email: "emily@example.com" },
    ]);
    expect(result.request.caregiverHandles).toEqual({ venmo: "sarah-k" });
  });

  it("drops blank sibling rows", () => {
    const result = toCreateRequest(
      draft({
        siblings: [
          { name: "Mike", email: "" },
          { name: "  ", email: "" },
        ],
      }),
    );
    expect(result.ok && result.request.siblings).toEqual([{ name: "Mike" }]);
  });

  it("requires names and at least one sibling", () => {
    const result = toCreateRequest(
      draft({ parentName: " ", caregiverName: "", siblings: [{ name: "", email: "" }] }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["caregiverName", "parentName", "siblings"]);
  });

  it("rejects a bad email and an email with no name", () => {
    const result = toCreateRequest(
      draft({
        siblings: [
          { name: "Mike", email: "mike@" },
          { name: "", email: "a@b.co" },
        ],
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors["sibling.0.email"]).toBeDefined();
    expect(result.errors["sibling.1.name"]).toBeDefined();
  });

  it.each(["", "abc", "-5", "100.01", "25.555"])("rejects hourly rate %j", (hourlyRate) => {
    const result = toCreateRequest(draft({ hourlyRate }));
    expect(result.ok === false && result.errors.hourlyRate).toBeTruthy();
  });

  it("accepts a $0 rate and cents", () => {
    expect(toCreateRequest(draft({ hourlyRate: "0" })).ok).toBe(true);
    const result = toCreateRequest(draft({ hourlyRate: "$27.50" }));
    expect(result.ok && result.request.hourlyRateCents).toBe(2750);
  });
});
