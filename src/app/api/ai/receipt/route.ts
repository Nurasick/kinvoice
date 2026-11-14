import { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES } from "@/shared/api";
import { IsoDate } from "@/shared/domain";
import { handle, HttpError, ok, requireWorkspace } from "@/server/http";
import { getAiService } from "@/server/ai";
import { requestLocale } from "@/server/ai/locale";

const ALLOWED: readonly string[] = RECEIPT_MIME_TYPES;

/** POST /api/ai/receipt — multipart `file` (+ optional `today`) → draft entry. Saves nothing. Owner: Olzhas. */
export const POST = handle(async (req: Request) => {
  await requireWorkspace(req);
  const form = await req.formData().catch(() => {
    throw new HttpError("bad_request", "Expected multipart/form-data");
  });
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError("bad_request", "Missing file");
  if (file.size > RECEIPT_MAX_BYTES) throw new HttpError("payload_too_large", "Receipt must be 5 MB or smaller");
  if (!ALLOWED.includes(file.type)) throw new HttpError("bad_request", "Upload a photo or a PDF");
  const todayField = form.get("today");
  const parsedToday = IsoDate.safeParse(todayField);
  const today = parsedToday.success ? parsedToday.data : new Date().toISOString().slice(0, 10);
  const bytes = new Uint8Array(await file.arrayBuffer());
  // The note's language comes from the app's `lang` cookie (the browser sends it with the upload).
  const input = { bytes, mimeType: file.type, today, locale: requestLocale(req) };
  return ok(await getAiService().extractReceipt(input));
});
