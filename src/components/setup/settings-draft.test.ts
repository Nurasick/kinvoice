import { describe, expect, it } from "vitest";
import type { Workspace } from "@/shared/domain";
import { confirmsDelete, draftFromWorkspace, isDirty, toUpdateRequest } from "./settings-draft";

const workspace: Workspace = {
  id: "w",
  parentName: "Mom (Linda)",
  hourlyRateCents: 2750,
  currency: "USD",
  caregiverHandles: { venmo: "sarah-demo", zelle: "sarah@example.com" },
  isDemo: true,
  createdAt: "2026-11-01T00:00:00.000Z",
};

describe("draftFromWorkspace", () => {
  it("shows dollars and empty strings for missing handles", () => {
    expect(draftFromWorkspace(workspace)).toEqual({
      parentName: "Mom (Linda)",
      hourlyRate: "27.50",
      venmo: "sarah-demo",
      paypal: "",
      zelle: "sarah@example.com",
    });
    expect(draftFromWorkspace({ ...workspace, hourlyRateCents: 2500 }).hourlyRate).toBe("25");
  });
});

describe("toUpdateRequest", () => {
  it("round-trips a saved workspace", () => {
    const result = toUpdateRequest(draftFromWorkspace(workspace));
    expect(result).toEqual({
      ok: true,
      patch: {
        parentName: "Mom (Linda)",
        hourlyRateCents: 2750,
        caregiverHandles: { venmo: "sarah-demo", zelle: "sarah@example.com" },
      },
    });
  });

  it("drops a cleared handle and a leading @", () => {
    const draft = { ...draftFromWorkspace(workspace), venmo: "@new-name", zelle: "  " };
    const result = toUpdateRequest(draft);
    expect(result.ok && result.patch.caregiverHandles).toEqual({ venmo: "new-name" });
  });

  it("rejects an empty name and a bad rate", () => {
    const result = toUpdateRequest({ ...draftFromWorkspace(workspace), parentName: " ", hourlyRate: "200" });
    expect(result.ok === false && Object.keys(result.errors).sort()).toEqual(["hourlyRate", "parentName"]);
  });
});

describe("helpers", () => {
  it("detects unsaved changes, ignoring surrounding spaces", () => {
    const saved = draftFromWorkspace(workspace);
    expect(isDirty({ ...saved, parentName: " Mom (Linda) " }, saved)).toBe(false);
    expect(isDirty({ ...saved, paypal: "sarahk" }, saved)).toBe(true);
  });

  it("confirms delete only with the parent's name", () => {
    expect(confirmsDelete("mom  (linda)", "Mom (Linda)")).toBe(true);
    expect(confirmsDelete("Mom", "Mom (Linda)")).toBe(false);
    expect(confirmsDelete("", "")).toBe(false);
  });
});
