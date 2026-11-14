"use client";
/**
 * Invoice composer state: AI draft (never auto-sent), caregiver edits, publish.
 * AI failure is not an error here: the server falls back to a template and we say so gently.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import { useLocale } from "@/lib/i18n/client";
import type { Invoice, InvoiceTone } from "@/shared/domain";

export interface Composer {
  tone: InvoiceTone;
  message: string;
  isDrafting: boolean;
  /** true when the text is the standard template rather than AI-written */
  isTemplate: boolean;
  isPublishing: boolean;
  error: string | null;
  published: Invoice | null;
  setTone: (tone: InvoiceTone) => void;
  setMessage: (message: string) => void;
  redraft: () => void;
  publish: () => Promise<void>;
  startOver: () => void;
}

export function useComposer(
  api: WorkspaceApi,
  month: string,
  enabled: boolean,
  onPublished: () => void,
): Composer {
  const [tone, setToneState] = useState<InvoiceTone>("warm");
  const [message, setMessage] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<Invoice | null>(null);
  const request = useRef(0);
  const { locale } = useLocale();

  const draft = useCallback(
    async (forTone: InvoiceTone): Promise<void> => {
      const id = ++request.current;
      setIsDrafting(true);
      setError(null);
      try {
        const res = await api.draftInvoiceMessage({ month, tone: forTone, locale });
        if (id !== request.current) return;
        setMessage(res.message);
        setIsTemplate(res.fallback);
      } catch {
        if (id === request.current)
          setError("We couldn't write a draft just now. You can type your own message.");
      } finally {
        if (id === request.current) setIsDrafting(false);
      }
    },
    [api, month, locale],
  );

  useEffect(() => {
    // A new month starts a fresh composer with a first draft (nothing is published until she clicks).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPublished(null);
    setMessage("");
    if (enabled) void draft(tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redraft only when the month or availability changes
  }, [draft, enabled]);

  const publish = useCallback(async (): Promise<void> => {
    if (!message.trim()) return setError("Add a short message before publishing.");
    setIsPublishing(true);
    setError(null);
    try {
      setPublished(await api.publishInvoice({ month, tone, message: message.trim() }));
      onPublished();
    } catch {
      setError("We couldn't publish just now. Your message is still here, so please try again.");
    } finally {
      setIsPublishing(false);
    }
  }, [api, month, tone, message, onPublished]);

  return {
    tone,
    message,
    isDrafting,
    isTemplate,
    isPublishing,
    error,
    published,
    setTone: (next) => {
      setToneState(next);
      void draft(next);
    },
    setMessage,
    redraft: () => void draft(tone),
    publish,
    startOver: () => setPublished(null),
  };
}
