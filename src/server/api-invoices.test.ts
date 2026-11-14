/**
 * API rules found in the pre-jury review: path ids, payment amounts, re-publishing,
 * and the sibling breakdown matching the frozen totals.
 */
import { describe, expect, it } from "vitest";
import { POST as createDemo } from "@/app/api/demo/route";
import { POST as createEntries } from "@/app/api/entries/route";
import { DELETE as deleteEntry, PATCH as patchEntry } from "@/app/api/entries/[id]/route";
import { POST as publishInvoice } from "@/app/api/invoices/route";
import { POST as markReceived } from "@/app/api/invoices/[id]/payments/route";
import { GET as getPublic } from "@/app/api/public/invoices/[token]/route";
import { POST as markSent } from "@/app/api/public/invoices/[token]/payments/route";
import { WORKSPACE_KEY_HEADER, type CreateWorkspaceResponse } from "@/shared/api";
import type { Invoice, PaymentMark, PublicInvoice } from "@/shared/domain";

const BASE = "http://test.local";

function req(path: string, init: { method?: string; body?: unknown; key?: string } = {}): Request {
  const headers = new Headers({ "content-type": "application/json" });
  if (init.key) headers.set(WORKSPACE_KEY_HEADER, init.key);
  const body = init.body === undefined ? undefined : JSON.stringify(init.body);
  return new Request(BASE + path, { method: init.method ?? "GET", headers, body });
}

const params = <T extends Record<string, string>>(p: T) => ({ params: Promise.resolve(p) });

async function data<T>(res: Response): Promise<T> {
  return ((await res.json()) as { data: T }).data;
}

const month = (): string => new Date().toISOString().slice(0, 7);
const today = (): string => new Date().toISOString().slice(0, 10);

async function demo(): Promise<CreateWorkspaceResponse> {
  return data<CreateWorkspaceResponse>(await createDemo());
}

async function publish(key: string): Promise<Invoice> {
  const res = await publishInvoice(
    req("/api/invoices", { method: "POST", key, body: { month: month(), tone: "warm", message: "Hi" } }),
  );
  expect(res.status).toBe(201);
  return data<Invoice>(res);
}

function sent(token: string, memberId: string, amountCents: number): Promise<Response> {
  const body = { memberId, amountCents, method: "venmo" };
  return markSent(req(`/api/public/invoices/${token}/payments`, { method: "POST", body }), params({ token }));
}

function received(key: string, id: string, memberId: string, amountCents = 21840): Promise<Response> {
  const body = { memberId, amountCents, method: "venmo" };
  return markReceived(req(`/api/invoices/${id}/payments`, { method: "POST", key, body }), params({ id }));
}

describe("path ids", () => {
  it("returns 404, not 500, for ids that are not UUIDs", async () => {
    const { editKey, view } = await demo();
    const entry = {
      kind: "time", date: today(), memberId: view.members[0].id, minutes: 30, category: "errands", note: "", source: "manual",
    };
    const patch = await patchEntry(
      req("/api/entries/abc", { method: "PATCH", key: editKey, body: entry }),
      params({ id: "abc" }),
    );
    expect(patch.status).toBe(404);
    const del = await deleteEntry(req("/api/entries/abc", { method: "DELETE", key: editKey }), params({ id: "abc" }));
    expect(del.status).toBe(404);
    expect((await received(editKey, "abc", view.members[1].id)).status).toBe(404);
  });
});

describe("payment marks", () => {
  it("takes the sent amount from the snapshot, not from the request body", async () => {
    const { editKey, view } = await demo();
    const inv = await publish(editKey);
    const mark = await data<PaymentMark>(await sent(inv.publicToken, view.members[1].id, 1));
    expect(mark.amountCents).toBe(21840);
  });

  it("refuses to mark the caregiver as received", async () => {
    const { editKey, view } = await demo();
    const inv = await publish(editKey);
    expect((await received(editKey, inv.id, view.members[0].id)).status).toBe(400);
  });

  it("carries payment marks over when the same month is published again", async () => {
    const { editKey, view } = await demo();
    const first = await publish(editKey);
    await received(editKey, first.id, view.members[1].id);
    const second = await publish(editKey);
    expect(second.id).not.toBe(first.id);
    expect(second.payments).toHaveLength(1);
    expect(second.payments[0]).toMatchObject({ memberId: view.members[1].id, status: "received" });
  });
});

describe("public breakdown", () => {
  it("lists only entries that existed when the invoice was published", async () => {
    const { editKey, view } = await demo();
    const inv = await publish(editKey);
    await new Promise((r) => setTimeout(r, 5));
    const late = {
      kind: "expense", date: today(), memberId: view.members[0].id, amountCents: 50000, category: "other",
      merchant: "AfterPublish", note: "", source: "manual",
    };
    await createEntries(req("/api/entries", { method: "POST", key: editKey, body: { entries: [late] } }));
    const t = inv.publicToken;
    const open = await data<PublicInvoice>(await getPublic(req(`/api/public/invoices/${t}`), params({ token: t })));
    const listed = open.entries.reduce((s, e) => s + (e.kind === "expense" ? e.amountCents : 0), 0);
    expect(open.entries.some((e) => e.kind === "expense" && e.merchant === "AfterPublish")).toBe(false);
    expect(listed).toBe(open.snapshot.totalOutOfPocketCents);
  });
});
