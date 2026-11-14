/**
 * Prompt text. Owner: Olzhas. Money in prompts is always pre-formatted by lib/money;
 * the model restates numbers, it never computes them.
 */
import type { Member, MonthlyBalance } from "@/shared/domain";
import { ExpenseCategory, TimeCategory } from "@/shared/domain";
import { formatCents, formatMinutes } from "@/lib/money";
import type { Locale } from "@/lib/i18n/locales";
import { CONTRIBUTION_PHRASE, LANGUAGE_NAME } from "./locale";
import { monthName } from "./template";
import type { InvoiceMessageInput } from "./types";

const CATEGORY_HINTS =
  "Pharmacy/drugstore purchases (CVS, Walgreens, prescriptions, vitamins, incontinence supplies) → medication; " +
  "doctor/lab/hospital bills and copays → medical; home_care is ONLY paid caregivers, aides or care agencies.";

const NOTE_RULE =
  "a short neutral description in everyday words (max ~60 chars), e.g. 'Drove Mom to a doctor's appointment'. " +
  "No diagnoses, specialties or drug names.";

export function quickLogInstructions(today: string, members: readonly Member[]): string {
  const people = members.map((m) => `- ${m.name} (${m.role}) → memberId "${m.id}"`).join("\n");
  return [
    "You turn a family caregiver's quick note about caring for an elderly parent into draft log entries.",
    "Return one draft per distinct expense (money paid) and one per distinct block of care time.",
    "A sentence can contain both: 'Paid $86 at CVS for meds, then drove her to the cardiologist, 3 hours' → one expense " +
      "(note 'Medication') AND one time entry (note 'Drove Mom to a doctor's appointment', never 'cardiologist').",
    "Rules:",
    "- amountCents: integer cents ($86 → 8600, $12.50 → 1250). Only for kind=expense. Never invent or estimate an amount; use null if not stated.",
    "- minutes: integer minutes (3 hours → 180, half an hour → 30). Only for kind=time. null if not stated.",
    `- date: YYYY-MM-DD. Today is ${today}. Resolve 'yesterday', 'on Monday' etc. relative to today. Use today if no date is mentioned.`,
    `- expense categories: ${ExpenseCategory.options.join(", ")}. ${CATEGORY_HINTS}`,
    `- time categories: ${TimeCategory.options.join(", ")}. Driving to/attending a doctor visit → appointments.`,
    "- merchant: store or company name for expenses (e.g. CVS), else null.",
    `- note: ${NOTE_RULE} Write it in the same language as the user's text (Russian text → Russian note, Kazakh → Kazakh).`,
    "- The text may be English, Russian or Kazakh ('3 часа' / '3 сағат' = 180 minutes, 'полчаса' / 'жарты сағат' = 30). Amounts are US dollars.",
    "- memberId: who paid / gave the time, only from this list; null if it's the writer or unclear:",
    people,
    "If the text describes no expense or care time, return an empty drafts array.",
  ].join("\n");
}

export function receiptInstructions(today: string): string {
  return [
    "Read this receipt for an elderly parent's care costs.",
    "amountCents: the final TOTAL actually paid, in integer cents (e.g. $43.17 → 4317). null if unreadable. Never guess.",
    `date: purchase date as YYYY-MM-DD (today is ${today}); null if not visible.`,
    "merchant: store/provider name, short (e.g. 'CVS Pharmacy').",
    `category: one of ${ExpenseCategory.options.join(", ")}. ${CATEGORY_HINTS}`,
    `note: what was bought, ${NOTE_RULE} Write 'Prescription' instead of Rx numbers or drug names.`,
    "isReceipt: false if the image is not a receipt or invoice; then set the other fields to null.",
  ].join("\n");
}

const TONES: Record<InvoiceMessageInput["tone"], string> = {
  warm: "warm and loving, like a sibling writing to family; grateful, never guilt-tripping",
  brief: "brief: 2-3 short sentences, friendly",
  direct: "direct and clear, polite and businesslike",
};

/** One member's facts. Zero amounts and zero time are left out entirely, so the model can't write "$0.00". */
function memberLine(m: MonthlyBalance["members"][number]): string {
  const parts = [
    m.paidCents > 0 ? `paid ${formatCents(m.paidCents)}` : null,
    m.minutes > 0 ? `gave ${formatMinutes(m.minutes)} of care` : null,
  ];
  if (m.role === "sibling") {
    parts.push(
      m.suggestedContributionCents > 0
        ? `suggested contribution ${formatCents(m.suggestedContributionCents)}`
        : "no contribution suggested this month",
    );
  }
  const facts = parts.filter((p): p is string => p !== null);
  return `${m.name} (${m.role}): ${facts.length > 0 ? facts.join(", ") : "nothing logged this month"}`;
}

function factLines(balance: MonthlyBalance): string[] {
  const lines = [`Month: ${monthName(balance.month)} ${balance.month.slice(0, 4)}`];
  if (balance.totalOutOfPocketCents > 0) {
    lines.push(`Total out-of-pocket care costs: ${formatCents(balance.totalOutOfPocketCents)}`);
  }
  if (balance.totalMinutes > 0) lines.push(`Total care time given: ${formatMinutes(balance.totalMinutes)}`);
  return [...lines, ...balance.members.map(memberLine)];
}

/** Language rules; English needs none beyond the defaults. */
function languageRules(locale: Locale): string[] {
  if (locale === "en") return [];
  return [
    `- Write the whole message in natural ${LANGUAGE_NAME[locale]}. Names stay as written.`,
    `- Call the ask '${CONTRIBUTION_PHRASE[locale]}'. Never words meaning debt or owing (e.g. долг, должен, қарыз).`,
    "- Keep every dollar amount exactly in the form given, like $218.40, with the $ sign first. Never write 'долларов' or convert currency.",
  ];
}

export function invoiceInstructions(input: InvoiceMessageInput, locale: Locale = "en"): string {
  return [
    `Write a short family update (at most 120 words) from ${input.caregiverName}, who cares for ${input.parentName}, to their siblings.`,
    `Language: ${LANGUAGE_NAME[locale]}. Tone: ${TONES[input.tone]}.`,
    "It goes on a page that already shows the full breakdown and pay buttons; this message is the personal note on top.",
    "Rules:",
    "- Write natural sentences in your own words. The facts below are data: never copy their labels (like 'Total care time given:').",
    "- You don't need every number (the page shows the breakdown), but name each sibling's suggested contribution exactly once.",
    "- Never write $0.00 or say someone paid or contributed nothing. For a sibling who paid nothing, don't mention spending at all: thank them for their time if they gave any, and still name their suggested contribution.",
    "- Use ONLY the numbers below, copied exactly as written. Do not add, round, sum or compute any number.",
    "- Say 'suggested contribution'. Never use the words 'owe', 'owes', 'debt' or 'pay me'.",
    "- No medical details. Plain text, no markdown, no subject line.",
    `- Sign off as ${input.caregiverName}.`,
    ...languageRules(locale),
    "Facts:",
    ...factLines(input.balance),
  ].join("\n");
}
