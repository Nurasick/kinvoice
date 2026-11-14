/**
 * API integration tests: real route handlers + services + in-memory repository.
 * Covers the demo happy path, auth, validation (400 with details) and payment-mark rules.
 */
import { describe, expect, it } from "vitest";
import { POST as createDemo } from "@/app/api/demo/route";
import { GET as getBalance } from "@/app/api/balance/route";
import { GET as listEntries, POST as createEntries } from "@/app/api/entries/route";
import { POST as publishInvoice } from "@/app/api/invoices/route";
import { POST as markReceived } from "@/app/api/invoices/[id]/payments/route";
import { GET as getPublic } from "@/app/api/public/invoices/[token]/route";
import { POST as markSent } from "@/app/api/public/invoices/[token]/payments/route";
import {
  DELETE as deleteWorkspace,
  GET as getWorkspace,
  PATCH as patchWorkspace,
} from "@/app/api/workspace/route";
import { POST as createWorkspace } from "@/app/api/workspaces/route";
import { WORKSPACE_KEY_HEADER } from "@/shared/api";
import type { CreateWorkspaceResponse } from "@/shared/api";
import type { Invoice, MonthlyBalance, PublicInvoice } from "@/shared/domain";

const BASE = "http://test.local";

function req(
  path: string,
  init: { method?: string; body?: unknown; key?: string; raw?: string } = {},
): Request {
  const headers = new Headers({ "content-type": "application/json" });
  if (init.key) headers.set(WORKSPACE_KEY_HEADER, init.key);
  const body = init.raw ?? (init.body === undefined ? undefined : JSON.stringify(init.body));
  return new Request(BASE + path, { method: init.method ?? "GET", headers, body });
}

const params = <T extends Record<string, string>>(p: T) => ({ params: Promise.resolve(p) });

async function json<T>(
  res: Response,
): Promise<{ status: number; data: T; error?: { code: string; details?: unknown } }> {
  const body = (await res.json()) as { data: T; error?: { code: string; details?: unknown } };
  return { status: res.status, data: body.data, error: body.error };
}

function thisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

async function demo(): Promise<CreateWorkspaceResponse> {
  const res = await json<CreateWorkspaceResponse>(await createDemo());
  expect(res.status).toBe(201);
  return res.data;
}

describe("demo happy path", () => {
  it("seeds Sarah's family with the documented totals", async () => {
    const { editKey, view } = await demo();
    expect(view.members.map((m) => m.name)).toEqual(["Sarah", "Mike", "Emily"]);
    const bal = await json<MonthlyBalance>(
      await getBalance(req(`/api/balance?month=${thisMonth()}`, { key: editKey })),
    );
    expect(bal.status).toBe(200);
    expect(bal.data.totalOutOfPocketCents).toBe(101519);
    const sum = bal.data.members.reduce((s, m) => s + m.fairShareCents, 0);
    expect(sum).toBe(bal.data.totalOutOfPocketCents);
  });

  it("publishes an invoice that siblings open without a key, and payment marks never downgrade", async () => {
    const { editKey, view } = await demo();
    const mike = view.members[1];
    const pub = await json<Invoice>(
      await publishInvoice(
        req("/api/invoices", {
          method: "POST",
          key: editKey,
          body: { month: thisMonth(), tone: "warm", message: "Hi all" },
        }),
      ),
    );
    expect(pub.status).toBe(201);
    const { publicToken, id } = pub.data;

    const open = await json<PublicInvoice>(
      await getPublic(req(`/api/public/invoices/${publicToken}`), params({ token: publicToken })),
    );
    expect(open.status).toBe(200);
    expect(open.data.caregiverName).toBe("Sarah");
    expect(open.data.snapshot.totalOutOfPocketCents).toBe(101519);

    const mark = { memberId: mike.id, amountCents: 21840, method: "venmo" };
    const sentPath = `/api/public/invoices/${publicToken}/payments`;
    const sent = await json<{ status: string }>(
      await markSent(req(sentPath, { method: "POST", body: mark }), params({ token: publicToken })),
    );
    expect(sent.data.status).toBe("sent");
    const recv = await json<{ status: string }>(
      await markReceived(
        req(`/api/invoices/${id}/payments`, { method: "POST", key: editKey, body: mark }),
        params({ id }),
      ),
    );
    expect(recv.data.status).toBe("received");
    const again = await json<{ status: string }>(
      await markSent(req(sentPath, { method: "POST", body: mark }), params({ token: publicToken })),
    );
    expect(again.data.status).toBe("received");
  });

  it("rejects the caregiver marking her own share as sent from the public link", async () => {
    const { editKey, view } = await demo();
    const pub = await json<Invoice>(
      await publishInvoice(
        req("/api/invoices", {
          method: "POST",
          key: editKey,
          body: { month: thisMonth(), tone: "brief", message: "x" },
        }),
      ),
    );
    const t = pub.data.publicToken;
    const res = await markSent(
      req(`/api/public/invoices/${t}/payments`, {
        method: "POST",
        body: { memberId: view.members[0].id, amountCents: 100, method: "venmo" },
      }),
      params({ token: t }),
    );
    expect(res.status).toBe(400);
  });

  it("deleting the workspace kills the key and the public link", async () => {
    const { editKey } = await demo();
    const pub = await json<Invoice>(
      await publishInvoice(
        req("/api/invoices", {
          method: "POST",
          key: editKey,
          body: { month: thisMonth(), tone: "warm", message: "x" },
        }),
      ),
    );
    expect((await deleteWorkspace(req("/api/workspace", { method: "DELETE", key: editKey }))).status).toBe(
      200,
    );
    expect((await getWorkspace(req("/api/workspace", { key: editKey }))).status).toBe(401);
    const t = pub.data.publicToken;
    expect((await getPublic(req(`/api/public/invoices/${t}`), params({ token: t }))).status).toBe(404);
  });
});

describe("auth", () => {
  it("returns 401 for a missing or unknown key", async () => {
    expect((await getWorkspace(req("/api/workspace"))).status).toBe(401);
    const res = await json(await getWorkspace(req("/api/workspace", { key: "not-a-real-key" })));
    expect(res.status).toBe(401);
    expect(res.error?.code).toBe("unauthorized");
  });

  it("returns 404 for an unknown invoice token", async () => {
    const res = await getPublic(req("/api/public/invoices/nope"), params({ token: "nope" }));
    expect(res.status).toBe(404);
  });
});

describe("validation", () => {
  async function entryStatus(entry: Record<string, unknown>): Promise<{ status: number; details?: unknown }> {
    const { editKey, view } = await demo();
    const body = {
      entries: [
        {
          kind: "expense",
          date: "2026-11-02",
          memberId: view.members[0].id,
          category: "medication",
          note: "",
          source: "manual",
          amountCents: 500,
          ...entry,
        },
      ],
    };
    const res = await json(await createEntries(req("/api/entries", { method: "POST", key: editKey, body })));
    return { status: res.status, details: res.error?.details };
  }

  it("accepts a valid entry", async () => {
    expect((await entryStatus({})).status).toBe(201);
  });

  it.each([
    ["impossible date", { date: "2026-13-45" }],
    ["Feb 30", { date: "2026-02-30" }],
    ["negative amount", { amountCents: -5 }],
    ["fractional cents", { amountCents: 12.5 }],
    ["amount over the cap", { amountCents: 10_000_000_000 }],
    ["unknown category", { category: "casino" }],
    ["note too long", { note: "x".repeat(281) }],
  ])("rejects %s with 400 and Zod details", async (_label, patch) => {
    const res = await entryStatus(patch);
    expect(res.status).toBe(400);
    expect(res.details).toBeDefined();
  });

  it("rejects time entries over a month of minutes", async () => {
    const { editKey, view } = await demo();
    const body = {
      entries: [
        {
          kind: "time",
          date: "2026-11-02",
          memberId: view.members[0].id,
          category: "errands",
          note: "",
          source: "manual",
          minutes: 10_000_000,
        },
      ],
    };
    expect((await createEntries(req("/api/entries", { method: "POST", key: editKey, body }))).status).toBe(
      400,
    );
  });

  it("rejects entries for a member outside the family", async () => {
    const res = await entryStatus({ memberId: "someone-else" });
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON and bad month queries", async () => {
    const { editKey } = await demo();
    expect(
      (await createEntries(req("/api/entries", { method: "POST", key: editKey, raw: "{nope" }))).status,
    ).toBe(400);
    expect((await listEntries(req("/api/entries?month=2026-13", { key: editKey }))).status).toBe(400);
  });

  it("validates workspace creation and patches", async () => {
    const bad = await createWorkspace(
      req("/api/workspaces", {
        method: "POST",
        body: { parentName: "", caregiverName: "A", siblings: [], hourlyRateCents: 0, caregiverHandles: {} },
      }),
    );
    expect(bad.status).toBe(400);
    const good = await json<CreateWorkspaceResponse>(
      await createWorkspace(
        req("/api/workspaces", {
          method: "POST",
          body: {
            parentName: "Dad",
            caregiverName: "Ana",
            siblings: [{ name: "Ben" }],
            hourlyRateCents: 2000,
            caregiverHandles: {},
          },
        }),
      ),
    );
    expect(good.status).toBe(201);
    expect(good.data.view.members.map((m) => m.role)).toEqual(["caregiver", "sibling"]);
    const patched = await patchWorkspace(
      req("/api/workspace", { method: "PATCH", key: good.data.editKey, body: { hourlyRateCents: -1 } }),
    );
    expect(patched.status).toBe(400);
  });
});
