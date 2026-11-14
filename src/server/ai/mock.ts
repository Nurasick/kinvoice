/**
 * Mock AI — used when OPENAI_API_KEY is empty or AI_MOCK=1. Owner: Olzhas.
 * Rule-based, deterministic, good enough to build every UI against.
 */
import type { DraftEntry } from "@/shared/domain";
import { parseDollarsToCents } from "@/lib/money";
import { localeOf } from "./locale";
import { templateInvoiceMessage } from "./template";
import type { AiService } from "./types";

const MERCHANTS = ["CVS", "Walgreens", "Kroger", "Walmart", "Target", "Uber", "Shell"];

function guessMerchant(text: string): string | undefined {
  return MERCHANTS.find((m) => text.toLowerCase().includes(m.toLowerCase()));
}

/** Hours/minutes in English, Russian ("3 часа", "45 минут") or Kazakh ("3 сағат"). */
function parseDuration(text: string): number | undefined {
  const hours = /(\d+(?:[.,]\d+)?)\s*(?:h|hr|hrs|hours?|ч|час\p{L}*|сағ\p{L}*)(?!\p{L})/iu.exec(text);
  if (hours) return Math.round(Number(hours[1].replace(",", ".")) * 60);
  const mins = /(\d+)\s*(?:m|min|mins|minutes?|мин\p{L}*)(?!\p{L})/iu.exec(text);
  return mins ? Number(mins[1]) : undefined;
}

export const mockAi: AiService = {
  async parseQuickLog({ text, today }) {
    const drafts: DraftEntry[] = [];
    const amount = /\$\s?([\d,]+(?:\.\d{1,2})?)/.exec(text);
    const amountCents = amount ? parseDollarsToCents(amount[1]) : null;
    if (amountCents) {
      const isMeds = /med|pharm|prescri|cvs|walgreens|лекарств|аптек|дәрі/i.test(text);
      drafts.push({
        kind: "expense",
        date: today,
        amountCents,
        category: isMeds ? "medication" : "other",
        merchant: guessMerchant(text),
        note: isMeds ? "Medication" : undefined,
      });
    }
    const minutes = parseDuration(text);
    if (minutes) {
      const isAppt = /doctor|cardio|appoint|clinic|dentist|drove|врач|кардиолог|отвез|дәрігер|апардым/i.test(text);
      drafts.push({ kind: "time", date: today, minutes, category: isAppt ? "appointments" : "other" });
    }
    return { drafts, fallback: drafts.length === 0 };
  },

  async extractReceipt({ today }) {
    return {
      draft: { kind: "expense", date: today, amountCents: 4317, category: "medication", merchant: "CVS Pharmacy", note: "Receipt (mock AI)" },
      fallback: false,
    };
  },

  async draftInvoiceMessage(input) {
    return { message: templateInvoiceMessage(input, localeOf(input)), fallback: false };
  },
};
