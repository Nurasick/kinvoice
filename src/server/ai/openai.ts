/**
 * Real OpenAI implementation of AiService. Owner: Olzhas.
 *
 * Responses API + strict JSON schema, then Zod-validated field by field (salvage.ts).
 * 12 s timeout, no retries. Never throws: any failure → `fallback: true` with
 * whatever could be salvaged. Logs never include the caregiver's text.
 */
import "server-only";
import OpenAI from "openai";
import type { DraftEntry } from "@/shared/domain";
import { getAiConfig } from "./config";
import { isSafeInvoiceMessage } from "./guard";
import { localeOf } from "./locale";
import { invoiceInstructions, quickLogInstructions, receiptInstructions } from "./prompts";
import { parseJsonSafe, salvageDraft, salvageDrafts } from "./salvage";
import { invoiceMessageSchema, quickLogSchema, receiptSchema, type JsonSchema } from "./schemas";
import { templateInvoiceMessage } from "./template";
import type { AiService, ReceiptInput } from "./types";

/** One user-content part sent to the model. */
export type ContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; detail: "auto" }
  | { type: "input_file"; file_data: string; filename: string };

/** The slice of the OpenAI client we use — lets tests pass a fake. */
export interface ResponsesClient {
  responses: {
    create(
      body: {
        model: string;
        reasoning: { effort: "minimal" | "low" };
        instructions: string;
        input: { role: "user"; content: ContentPart[] }[];
        text: { format: { type: "json_schema"; name: string; schema: JsonSchema; strict: true } };
      },
      options: { signal: AbortSignal; maxRetries: number; timeout: number },
    ): Promise<{ output_text?: string | null }>;
  };
}

export interface OpenAiDeps {
  client: ResponsesClient;
  model: string;
  timeoutMs: number;
}

interface JsonCall {
  name: string;
  instructions: string;
  content: ContentPart[];
  schema: JsonSchema;
}

function logFailure(op: string, err: unknown, ms: number): void {
  const name = err instanceof Error ? err.name : "UnknownError";
  console.warn(`[ai] ${op} failed: ${name} after ${ms}ms`);
}

/** One line per call for p50/p95 in the Vercel logs. Op name and duration only, never user text. */
function logTiming(op: string, ms: number): void {
  console.info(`[ai] ${op} ok ${ms}ms`);
}

/** Calls the model and returns parsed JSON, or null on any error/timeout/invalid JSON. */
async function callJson(deps: OpenAiDeps, call: JsonCall): Promise<unknown> {
  const started = Date.now();
  const elapsed = () => Date.now() - started;
  try {
    const res = await deps.client.responses.create(
      {
        model: deps.model,
        // Default reasoning takes 9–14 s on gpt-5-mini and trips the 12 s timeout; minimal answers in 3–5 s.
        reasoning: { effort: "minimal" },
        instructions: call.instructions,
        input: [{ role: "user", content: call.content }],
        text: { format: { type: "json_schema", name: call.name, schema: call.schema, strict: true } },
      },
      { signal: AbortSignal.timeout(deps.timeoutMs), maxRetries: 0, timeout: deps.timeoutMs },
    );
    const parsed = parseJsonSafe(res.output_text);
    if (parsed === null) logFailure(call.name, new SyntaxError("invalid JSON"), elapsed());
    else logTiming(call.name, elapsed());
    return parsed;
  } catch (err: unknown) {
    logFailure(call.name, err, elapsed());
    return null;
  }
}

function toBase64DataUrl(bytes: Uint8Array, mimeType: string): string {
  return `data:${mimeType};base64,${Buffer.from(bytes).toString("base64")}`;
}

/** HEIC isn't accepted by the vision API; the UI falls back to the manual form. */
export function receiptContent({ bytes, mimeType }: ReceiptInput): ContentPart | null {
  if (mimeType === "application/pdf") {
    return { type: "input_file", file_data: toBase64DataUrl(bytes, mimeType), filename: "receipt.pdf" };
  }
  if (["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    return { type: "input_image", image_url: toBase64DataUrl(bytes, mimeType), detail: "auto" };
  }
  return null;
}

function receiptDraft(raw: unknown): { draft: DraftEntry | null; complete: boolean } {
  if (typeof raw !== "object" || raw === null || (raw as { isReceipt?: unknown }).isReceipt === false) {
    return { draft: null, complete: false };
  }
  const draft = salvageDraft(raw, [], "expense");
  return { draft, complete: draft?.amountCents !== undefined };
}

export function createOpenAiService(deps?: OpenAiDeps): AiService {
  const resolved = deps ?? defaultDeps();
  return {
    async parseQuickLog(input) {
      const { text, today, members } = input;
      const raw = await callJson(resolved, {
        name: "quick_log",
        instructions: quickLogInstructions(today, members, localeOf(input)),
        content: [{ type: "input_text", text }],
        schema: quickLogSchema(members.map((m) => m.id)),
      });
      const { drafts, lossy } = salvageDrafts(raw, members.map((m) => m.id));
      return { drafts, fallback: lossy || drafts.length === 0 };
    },

    async extractReceipt(input) {
      const part = receiptContent(input);
      if (!part) return { draft: null, fallback: true };
      const raw = await callJson(resolved, {
        name: "receipt",
        instructions: receiptInstructions(input.today, localeOf(input)),
        content: [part],
        schema: receiptSchema,
      });
      const { draft, complete } = receiptDraft(raw);
      return { draft, fallback: !complete };
    },

    async draftInvoiceMessage(input) {
      const locale = localeOf(input);
      const raw = await callJson(resolved, {
        name: "invoice_message",
        instructions: invoiceInstructions(input, locale),
        content: [{ type: "input_text", text: `Write the ${input.tone} message now.` }],
        schema: invoiceMessageSchema,
      });
      const message = typeof raw === "object" && raw !== null ? (raw as { message?: unknown }).message : null;
      if (typeof message === "string" && isSafeInvoiceMessage(message, input.balance)) {
        return { message: message.trim(), fallback: false };
      }
      return { message: templateInvoiceMessage(input, locale), fallback: true };
    },
  };
}

function defaultDeps(): OpenAiDeps {
  const config = getAiConfig();
  const client = new OpenAI({ apiKey: config.apiKey ?? "", maxRetries: 0, timeout: config.timeoutMs });
  return { client, model: config.model, timeoutMs: config.timeoutMs };
}
