"use client";
/** "Type one messy sentence" box. Owner: Olzhas. */
import { useState, type FormEvent } from "react";
import { Button, Card, Spinner, inputClass } from "./ui";

const EXAMPLE = "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours.";

export function QuickLogBox({ onSubmit }: { onSubmit: (text: string) => Promise<boolean> }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const tooShort = text.trim().length < 3;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (tooShort || busy) return;
    setBusy(true);
    const clear = await onSubmit(text.trim());
    setBusy(false);
    if (clear) setText("");
  }

  return (
    <Card>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label htmlFor="quick-log" className="text-base font-semibold text-stone-900">
          What happened?
        </label>
        <p className="-mt-2 text-sm text-stone-600">
          Write it like a text message. We&apos;ll turn it into entries for you to check.
        </p>
        <textarea
          id="quick-log"
          rows={3}
          maxLength={500}
          className={`${inputClass} resize-y`}
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit(e);
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="text-left text-xs text-teal-800 underline-offset-2 hover:underline" onClick={() => setText(EXAMPLE)}>
            Try an example
          </button>
          {busy ? <Spinner label="Reading your note…" /> : <Button type="submit" disabled={tooShort}>Turn into entries</Button>}
        </div>
      </form>
    </Card>
  );
}
