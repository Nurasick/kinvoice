/**
 * Repository contract tests. Always run against the in-memory repo; also against Postgres
 * when TEST_DATABASE_URL points at a disposable database (never prod).
 */
import { describe, expect, it } from "vitest";
import type { NewEntry } from "@/shared/domain";
import { hashKey, newSecretToken } from "../tokens";
import { memoryRepository } from "./memory";
import { createPostgresRepository, monthRange } from "./postgres";
import type { Repository } from "./types";

const targets: Array<[string, () => Repository]> = [["memory", () => memoryRepository]];
const testDbUrl = process.env.TEST_DATABASE_URL;
if (testDbUrl) targets.push(["postgres", () => createPostgresRepository(testDbUrl)]);

const snapshot = {
  month: "2026-11",
  totalOutOfPocketCents: 0,
  totalMinutes: 0,
  totalTimeValueCents: 0,
  hourlyRateCents: 2500,
  members: [],
  byExpenseCategory: {},
  byTimeCategory: {},
};

async function seedWorkspace(repo: Repository) {
  const view = await repo.createWorkspace({
    editKeyHash: hashKey(newSecretToken()),
    parentName: "Mom",
    hourlyRateCents: 2500,
    caregiverHandles: { venmo: "sarah" },
    isDemo: false,
    members: [
      { name: "Sarah", role: "caregiver" },
      { name: "Mike", role: "sibling", email: "mike@example.com" },
    ],
  });
  const [sarah, mike] = view.members;
  return { view, sarah, mike };
}

function expense(memberId: string, date: string, amountCents: number): NewEntry {
  return { kind: "expense", memberId, date, amountCents, category: "medication", note: "", source: "manual" };
}

describe.each(targets)("%s repository", (_name, make) => {
  it("creates a workspace with members in order and finds it by key hash", async () => {
    const repo = make();
    const key = newSecretToken();
    const view = await repo.createWorkspace({
      editKeyHash: hashKey(key),
      parentName: "Dad",
      hourlyRateCents: 2000,
      caregiverHandles: {},
      isDemo: true,
      members: [
        { name: "A", role: "caregiver" },
        { name: "B", role: "sibling" },
        { name: "C", role: "sibling" },
      ],
    });
    expect(view.members.map((m) => m.name)).toEqual(["A", "B", "C"]);
    expect((await repo.findWorkspaceByKeyHash(hashKey(key)))?.workspace.id).toBe(view.workspace.id);
    expect(await repo.findWorkspaceByKeyHash(hashKey("wrong"))).toBeNull();
  });

  it("lists only the requested month's entries, newest first, and scopes edits to the workspace", async () => {
    const repo = make();
    const { view, sarah } = await seedWorkspace(repo);
    const other = await seedWorkspace(repo);
    await repo.createEntries(view.workspace.id, [
      expense(sarah.id, "2026-11-02", 1000),
      expense(sarah.id, "2026-11-20", 2000),
      expense(sarah.id, "2026-12-01", 3000),
    ]);
    const nov = await repo.listEntries(view.workspace.id, "2026-11");
    expect(nov.map((e) => e.date)).toEqual(["2026-11-20", "2026-11-02"]);

    const target = nov[0];
    expect(await repo.updateEntry(other.view.workspace.id, target.id, expense(sarah.id, "2026-11-20", 1))).toBeNull();
    expect(await repo.deleteEntry(other.view.workspace.id, target.id)).toBe(false);
    const updated = await repo.updateEntry(view.workspace.id, target.id, expense(sarah.id, "2026-11-21", 2500));
    expect(updated).toMatchObject({ amountCents: 2500, date: "2026-11-21" });
    expect(await repo.deleteEntry(view.workspace.id, target.id)).toBe(true);
  });

  it("publishes invoices and upserts one payment mark per member", async () => {
    const repo = make();
    const { view, mike } = await seedWorkspace(repo);
    const publicToken = newSecretToken();
    const invoice = await repo.createInvoice(view.workspace.id, {
      month: "2026-11",
      tone: "warm",
      message: "Hi",
      snapshot,
      publicToken,
    });
    await repo.upsertPayment(invoice.id, { memberId: mike.id, amountCents: 500, method: "venmo", status: "sent" });
    await repo.upsertPayment(invoice.id, { memberId: mike.id, amountCents: 500, method: "venmo", status: "received" });

    const found = await repo.findInvoiceByToken(publicToken);
    expect(found?.workspaceId).toBe(view.workspace.id);
    expect(found?.invoice.payments).toHaveLength(1);
    expect(found?.invoice.payments[0].status).toBe("received");
    expect(await repo.findInvoiceByToken(newSecretToken())).toBeNull();
  });

  it("deletes everything with the workspace", async () => {
    const repo = make();
    const { view } = await seedWorkspace(repo);
    await repo.deleteWorkspace(view.workspace.id);
    expect(await repo.findWorkspaceById(view.workspace.id)).toBeNull();
  });
});

describe("monthRange", () => {
  it("handles December rollover", () => {
    expect(monthRange("2026-12")).toEqual(["2026-12-01", "2027-01-01"]);
    expect(monthRange("2026-02")).toEqual(["2026-02-01", "2026-03-01"]);
  });
});
