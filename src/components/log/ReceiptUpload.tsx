"use client";
/** Snap or upload a receipt (photo or PDF, ≤ 5 MB). Owner: Olzhas. */
import { useRef, useState, type ChangeEvent } from "react";
import { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES } from "@/shared/api";
import { Button, Card, CardHeader } from "@/components/ui";
import type { LogCopy } from "./copy";
import { useLogCopy } from "./copy-context";

const ALLOWED: readonly string[] = RECEIPT_MIME_TYPES;

/** Returns a friendly problem, or null if the file can be sent. */
function checkFile(file: File, t: LogCopy["receipt"]): string | null {
  if (file.size > RECEIPT_MAX_BYTES) return t.tooBig;
  if (!ALLOWED.includes(file.type)) return t.badType;
  return null;
}

export function ReceiptUpload({ onFile }: { onFile: (file: File) => Promise<void> }) {
  const { t } = useLogCopy();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const issue = checkFile(file, t.receipt);
    setProblem(issue);
    if (issue) return;
    setBusy(true);
    await onFile(file);
    setBusy(false);
  }

  return (
    <Card>
      <CardHeader title={t.receipt.title} description={t.receipt.hint} />
      <input ref={input} type="file" accept={RECEIPT_MIME_TYPES.join(",")} className="sr-only" onChange={pick} aria-label={t.receipt.fileLabel} tabIndex={-1} />
      <Button variant="secondary" isLoading={busy} onClick={() => input.current?.click()}>
        {busy ? t.receipt.busy : t.receipt.add}
      </Button>
      {problem ? <p className="mt-2 text-sm text-danger">{problem}</p> : null}
    </Card>
  );
}
