"use client";
/** Snap or upload a receipt (photo or PDF, ≤ 5 MB). Owner: Olzhas. */
import { useRef, useState, type ChangeEvent } from "react";
import { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES } from "@/shared/api";
import { Button, Card, Spinner } from "./ui";

const ALLOWED: readonly string[] = RECEIPT_MIME_TYPES;

export function ReceiptUpload({ onFile }: { onFile: (file: File) => Promise<void> }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > RECEIPT_MAX_BYTES) return setProblem("That file is over 5 MB — try a smaller photo.");
    if (!ALLOWED.includes(file.type)) return setProblem("Please use a photo (JPG, PNG, WebP, HEIC) or a PDF.");
    setProblem(null);
    setBusy(true);
    await onFile(file);
    setBusy(false);
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Have a receipt?</h2>
        <p className="text-sm text-stone-600">Snap a photo or upload a PDF. We&apos;ll fill in the amount for you to check.</p>
      </div>
      <input ref={input} type="file" accept={RECEIPT_MIME_TYPES.join(",")} capture="environment" className="sr-only" onChange={pick} aria-label="Receipt file" />
      <div className="flex items-center gap-3">
        {busy ? (
          <Spinner label="Reading the receipt…" />
        ) : (
          <Button variant="secondary" onClick={() => input.current?.click()}>
            Add a receipt
          </Button>
        )}
      </div>
      {problem ? <p className="text-sm text-red-700">{problem}</p> : null}
    </Card>
  );
}
