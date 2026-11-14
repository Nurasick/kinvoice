"use client";
/** "Type one messy sentence" box. Owner: Olzhas. */
import { useState, type FormEvent } from "react";
import { Button, Card, Textarea } from "@/components/ui";
import { useLogCopy } from "./copy-context";

export function QuickLogBox({ onSubmit }: { onSubmit: (text: string) => Promise<boolean> }) {
  const { t } = useLogCopy();
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
            {t.quick.title}
          </label>
          <p className="mt-0.5 text-sm text-ink-muted">{t.quick.hint}</p>
        </div>
        <Textarea
          id="quick-log"
          rows={3}
          maxLength={500}
          className="resize-y"
          placeholder={t.quick.example}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit(e);
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="text-sm text-accent-strong underline-offset-2 hover:underline" onClick={() => setText(t.quick.example)}>
            {t.quick.tryExample}
          </button>
          <Button type="submit" disabled={tooShort} isLoading={busy}>
            {busy ? t.quick.busy : t.quick.submit}
          </Button>
        </div>
      </form>
    </Card>
  );
}
