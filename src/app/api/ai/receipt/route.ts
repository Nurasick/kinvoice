import { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES } from "@/shared/api";
import { handle, HttpError, ok, requireWorkspace } from "@/server/http";
import { getAiService } from "@/server/ai";

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
  const today = typeof todayField === "string" ? todayField : new Date().toISOString().slice(0, 10);
  const bytes = new Uint8Array(await file.arrayBuffer());
  return ok(await getAiService().extractReceipt({ bytes, mimeType: file.type, today }));
});
