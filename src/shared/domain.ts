/**
 * SHARED CONTRACT — frozen. Owner: Nurali. Do not edit without the owner (see docs/ROLES.md).
 *
 * Domain types for Kinvoice. Every type is derived from a Zod schema so the same
 * definition validates API input, AI output and DB rows.
 *
 * Money is ALWAYS integer cents (`*Cents`). Time is ALWAYS integer minutes.
 */
import { z } from "zod";

// ---------- primitives ----------

/** Calendar date, "YYYY-MM-DD" (no timezone; the caregiver's local day). */
export const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");
/** Calendar month, "YYYY-MM". */
export const IsoMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected YYYY-MM");
/** Non-negative integer number of cents. */
export const Cents = z.number().int().nonnegative();
/** Positive integer number of minutes. */
export const Minutes = z.number().int().positive();
export const Id = z.string().min(1);

// ---------- enums ----------

export const ExpenseCategory = z.enum([
  "medication",
  "medical",
  "groceries",
  "transport",
  "household",
  "home_care",
  "insurance",
  "other",
]);
export type ExpenseCategory = z.infer<typeof ExpenseCategory>;

export const TimeCategory = z.enum([
  "appointments",
  "errands",
  "personal_care",
  "companionship",
  "household",
  "admin",
  "other",
]);
export type TimeCategory = z.infer<typeof TimeCategory>;

export const EntrySource = z.enum(["manual", "quick_log", "receipt"]);
export type EntrySource = z.infer<typeof EntrySource>;

export const MemberRole = z.enum(["caregiver", "sibling"]);
export type MemberRole = z.infer<typeof MemberRole>;

export const InvoiceTone = z.enum(["warm", "brief", "direct"]);
export type InvoiceTone = z.infer<typeof InvoiceTone>;

export const PaymentMethod = z.enum(["venmo", "paypal", "zelle", "other"]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

/** "sent" = sibling says they paid; "received" = caregiver confirmed it. */
export const PaymentStatus = z.enum(["sent", "received"]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

// ---------- members & workspace ----------

/** Where the caregiver wants to be paid. All optional; pay buttons only show for filled ones. */
export const PaymentHandles = z.object({
  venmo: z.string().trim().max(64).optional(),
  paypal: z.string().trim().max(64).optional(),
  zelle: z.string().trim().max(128).optional(),
});
export type PaymentHandles = z.infer<typeof PaymentHandles>;

export const Member = z.object({
  id: Id,
  name: z.string().trim().min(1).max(60),
  role: MemberRole,
  email: z.email().optional(),
});
export type Member = z.infer<typeof Member>;

export const Workspace = z.object({
  id: Id,
  parentName: z.string().trim().min(1).max(60),
  /** Value of one hour of care time, shown separately from money. */
  hourlyRateCents: Cents,
  currency: z.literal("USD"),
  caregiverHandles: PaymentHandles,
  isDemo: z.boolean(),
  createdAt: z.iso.datetime(),
});
export type Workspace = z.infer<typeof Workspace>;

/** Workspace + its members. Exactly one member has role "caregiver". */
export const WorkspaceView = z.object({
  workspace: Workspace,
  members: z.array(Member).min(1),
});
export type WorkspaceView = z.infer<typeof WorkspaceView>;

// ---------- entries ----------

const EntryBase = z.object({
  date: IsoDate,
  /** Who paid (expense) or who gave the time (time). */
  memberId: Id,
  note: z.string().trim().max(280).default(""),
  source: EntrySource,
});

export const ExpenseFields = EntryBase.extend({
  kind: z.literal("expense"),
  amountCents: Cents.refine((v) => v > 0, "Amount must be positive"),
  category: ExpenseCategory,
  merchant: z.string().trim().max(80).optional(),
});

export const TimeFields = EntryBase.extend({
  kind: z.literal("time"),
  minutes: Minutes,
  category: TimeCategory,
});

/** Input to create an entry (no id). */
export const NewEntry = z.discriminatedUnion("kind", [ExpenseFields, TimeFields]);
export type NewEntry = z.infer<typeof NewEntry>;

export const Entry = z.discriminatedUnion("kind", [
  ExpenseFields.extend({ id: Id, createdAt: z.iso.datetime() }),
  TimeFields.extend({ id: Id, createdAt: z.iso.datetime() }),
]);
export type Entry = z.infer<typeof Entry>;
export type ExpenseEntry = Extract<Entry, { kind: "expense" }>;
export type TimeEntry = Extract<Entry, { kind: "time" }>;

/**
 * What the AI returns: a NewEntry where any field may be missing.
 * The UI shows it as a card; the caregiver fills gaps and confirms.
 * `memberId` is usually omitted by the AI (UI defaults it to the caregiver).
 */
export const DraftEntry = z.object({
  kind: z.enum(["expense", "time"]),
  date: IsoDate.optional(),
  memberId: Id.optional(),
  amountCents: Cents.optional(),
  minutes: Minutes.optional(),
  category: z.union([ExpenseCategory, TimeCategory]).optional(),
  merchant: z.string().max(80).optional(),
  note: z.string().max(280).optional(),
});
export type DraftEntry = z.infer<typeof DraftEntry>;

// ---------- balance (computed, never stored except in invoice snapshots) ----------

export const MemberBalance = z.object({
  memberId: Id,
  name: z.string(),
  role: MemberRole,
  /** Out-of-pocket money this member paid this month. */
  paidCents: Cents,
  /** Care time this member gave this month. */
  minutes: z.number().int().nonnegative(),
  /** minutes valued at the workspace hourly rate. Informational only, NOT in the split. */
  timeValueCents: Cents,
  /** Equal share of total out-of-pocket costs. */
  fairShareCents: Cents,
  /**
   * Siblings: max(0, fairShare - paid). Caregiver: always 0.
   * Labelled "suggested contribution" in the UI — never "you owe".
   */
  suggestedContributionCents: Cents,
});
export type MemberBalance = z.infer<typeof MemberBalance>;

export const MonthlyBalance = z.object({
  month: IsoMonth,
  totalOutOfPocketCents: Cents,
  totalMinutes: z.number().int().nonnegative(),
  totalTimeValueCents: Cents,
  hourlyRateCents: Cents,
  members: z.array(MemberBalance),
  byExpenseCategory: z.partialRecord(ExpenseCategory, Cents),
  byTimeCategory: z.partialRecord(TimeCategory, z.number().int().nonnegative()),
});
export type MonthlyBalance = z.infer<typeof MonthlyBalance>;

// ---------- invoices & payments ----------

export const PaymentMark = z.object({
  id: Id,
  invoiceId: Id,
  memberId: Id,
  amountCents: Cents,
  method: PaymentMethod,
  status: PaymentStatus,
  updatedAt: z.iso.datetime(),
});
export type PaymentMark = z.infer<typeof PaymentMark>;

export const Invoice = z.object({
  id: Id,
  month: IsoMonth,
  /** Unguessable read-only token; public URL is /i/{publicToken}. */
  publicToken: z.string().min(20),
  tone: InvoiceTone,
  message: z.string().max(4000),
  /** Balance frozen at publish time, so later edits don't silently change a sent invoice. */
  snapshot: MonthlyBalance,
  publishedAt: z.iso.datetime(),
  payments: z.array(PaymentMark),
});
export type Invoice = z.infer<typeof Invoice>;

/** What a sibling sees at /i/{token}. Contains no edit key and no internal ids beyond member ids. */
export const PublicInvoice = z.object({
  parentName: z.string(),
  caregiverName: z.string(),
  caregiverHandles: PaymentHandles,
  month: IsoMonth,
  message: z.string(),
  snapshot: MonthlyBalance,
  /** This month's entries, so siblings can see where the money went. */
  entries: z.array(Entry),
  payments: z.array(PaymentMark),
  publishedAt: z.iso.datetime(),
});
export type PublicInvoice = z.infer<typeof PublicInvoice>;
