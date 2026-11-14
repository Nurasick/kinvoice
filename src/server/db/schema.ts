/**
 * Postgres schema (Drizzle). Owner: Nurali. Mirrors src/shared/domain.ts.
 * Money = integer cents, time = integer minutes. All rows cascade from workspaces.
 */
import { boolean, date, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { MonthlyBalance, PaymentHandles } from "@/shared/domain";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  editKeyHash: text("edit_key_hash").notNull().unique(),
  parentName: text("parent_name").notNull(),
  hourlyRateCents: integer("hourly_rate_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  caregiverHandles: jsonb("caregiver_handles").$type<PaymentHandles>().notNull().default({}),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role", { enum: ["caregiver", "sibling"] }).notNull(),
  email: text("email"),
  position: integer("position").notNull(),
});

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["expense", "time"] }).notNull(),
    date: date("date", { mode: "string" }).notNull(),
    amountCents: integer("amount_cents"), // expense only
    minutes: integer("minutes"), // time only
    category: text("category").notNull(),
    merchant: text("merchant"),
    note: text("note").notNull().default(""),
    source: text("source", { enum: ["manual", "quick_log", "receipt"] }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("entries_workspace_date_idx").on(t.workspaceId, t.date)],
);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  month: text("month").notNull(), // YYYY-MM
  publicToken: text("public_token").notNull().unique(),
  tone: text("tone", { enum: ["warm", "brief", "direct"] }).notNull(),
  message: text("message").notNull(),
  snapshot: jsonb("snapshot").$type<MonthlyBalance>().notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentMarks = pgTable(
  "payment_marks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    amountCents: integer("amount_cents").notNull(),
    method: text("method", { enum: ["venmo", "paypal", "zelle", "other"] }).notNull(),
    status: text("status", { enum: ["sent", "received"] }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("payment_marks_invoice_member_uq").on(t.invoiceId, t.memberId)],
);
