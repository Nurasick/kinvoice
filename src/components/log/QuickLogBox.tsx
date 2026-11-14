"use client";
/** "Type one messy sentence" box. Owner: Olzhas. */
import { useState, type FormEvent } from "react";
import { Button, Card, Textarea } from "@/components/ui";

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
        <div>
          <label htmlFor="quick-log" className="font-display text-lg font-medium text-ink">
            What happened?
          </label>
          <p className="mt-0.5 text-sm text-ink-muted">Write it like a text message. We&apos;ll turn it into entries for you to check.</p>
        </div>
        <Textarea
          id="quick-log"
          rows={3}
          maxLength={500}
          className="resize-y"
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit(e);
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="text-sm text-accent-strong underline-offset-2 hover:underline" onClick={() => setText(EXAMPLE)}>
            Try an example
          </button>
          <Button type="submit" disabled={tooShort} isLoading={busy}>
            {busy ? "Reading your note…" : "Turn into entries"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
