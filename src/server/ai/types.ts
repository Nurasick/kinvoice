/**
 * SHARED CONTRACT — frozen. Owner: Nurali. Implemented by Olzhas (openai.ts) and mock.ts.
 *
 * The AI service NEVER throws. On failure, timeout or invalid output it returns
 * `fallback: true` with whatever could be salvaged. It never computes money:
 * draftInvoiceMessage receives the already-computed balance and only puts it into words.
 */
import type {
  InvoiceMessageResponse,
  QuickLogResponse,
  ReceiptResponse,
} from "@/shared/api";
import type { InvoiceTone, Member, MonthlyBalance } from "@/shared/domain";

export interface QuickLogInput {
  text: string;
  /** YYYY-MM-DD, caregiver's local today */
  today: string;
  /** So the model can attribute "Mike paid…" to Mike's id. */
  members: readonly Member[];
}

export interface ReceiptInput {
  bytes: Uint8Array;
  mimeType: string;
  today: string;
}

export interface InvoiceMessageInput {
  tone: InvoiceTone;
  parentName: string;
  caregiverName: string;
  balance: MonthlyBalance;
}

export interface AiService {
  parseQuickLog(input: QuickLogInput): Promise<QuickLogResponse>;
  extractReceipt(input: ReceiptInput): Promise<ReceiptResponse>;
  draftInvoiceMessage(input: InvoiceMessageInput): Promise<InvoiceMessageResponse>;
}
