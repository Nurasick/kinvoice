/**
 * JSON Schemas for OpenAI structured outputs (strict mode). Owner: Olzhas.
 * Strict mode needs every property listed as required, so "unknown" is `null`.
 * The output is validated again with Zod in salvage.ts — this schema only steers the model.
 */
import { ExpenseCategory, TimeCategory } from "@/shared/domain";

export type JsonSchema = Record<string, unknown>;

const nullableString = (maxLength: number): JsonSchema => ({ type: ["string", "null"], maxLength });
const nullableInt: JsonSchema = { type: ["integer", "null"] };

function draftSchema(memberIds: readonly string[]): JsonSchema {
  return {
    type: "object",
    additionalProperties: false,
    required: ["kind", "date", "memberId", "amountCents", "minutes", "category", "merchant", "note"],
    properties: {
      kind: { type: "string", enum: ["expense", "time"] },
      date: { type: ["string", "null"], description: "YYYY-MM-DD" },
      memberId: { type: ["string", "null"], enum: [...memberIds, null] },
      amountCents: { ...nullableInt, description: "Expense only. Integer cents: $86 → 8600." },
      minutes: { ...nullableInt, description: "Time only. Integer minutes: 3 hours → 180." },
      category: {
        type: ["string", "null"],
        enum: [...new Set([...ExpenseCategory.options, ...TimeCategory.options]), null],
      },
      merchant: nullableString(80),
      note: nullableString(280),
    },
  };
}

export function quickLogSchema(memberIds: readonly string[]): JsonSchema {
  return {
    type: "object",
    additionalProperties: false,
    required: ["drafts"],
    properties: { drafts: { type: "array", items: draftSchema(memberIds) } },
  };
}

export const receiptSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["isReceipt", "amountCents", "merchant", "date", "category", "note"],
  properties: {
    isReceipt: { type: "boolean" },
    amountCents: { ...nullableInt, description: "Total paid in integer cents." },
    merchant: nullableString(80),
    date: { type: ["string", "null"], description: "YYYY-MM-DD" },
    category: { type: ["string", "null"], enum: [...ExpenseCategory.options, null] },
    note: nullableString(280),
  },
};

export const invoiceMessageSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["message"],
  properties: { message: { type: "string", maxLength: 1500 } },
};
