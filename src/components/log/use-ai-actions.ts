"use client";
/**
 * Quick log + receipt → draft cards. Owner: Olzhas.
 * Any AI failure opens a manual card (prefilled where possible) — never an error page.
 */
import { useCallback } from "react";
import { ApiError, type WorkspaceApi } from "@/lib/api/client";
import { localToday } from "./draft-form";
import type { DraftsState } from "./use-drafts";

const QUICK_FALLBACK = "I couldn't read all of that — I filled in what I could. Please check the card below.";
const AI_DOWN = "The assistant is taking a break — you can enter it here instead.";
const RECEIPT_PARTIAL = "Some of the receipt was hard to read — please check the amount.";
const RECEIPT_FAILED = "I couldn't read that receipt — you can enter it here.";

export function useAiActions(api: WorkspaceApi | null, drafts: DraftsState) {
  const { addDrafts, addEmpty, setNotice } = drafts;

  /** Returns true when the text box can be cleared. */
  const quickLog = useCallback(
    async (text: string): Promise<boolean> => {
      if (!api) return false;
      setNotice(null);
      try {
        const res = await api.quickLog({ text, today: localToday() });
        if (res.drafts.length > 0) addDrafts(res.drafts, "quick_log");
        else addEmpty("expense", text);
        if (res.fallback) setNotice({ tone: "info", text: QUICK_FALLBACK });
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 401) return false;
        addEmpty("expense", text);
        setNotice({ tone: "info", text: AI_DOWN });
      }
      return true;
    },
    [api, addDrafts, addEmpty, setNotice],
  );

  const receipt = useCallback(
    async (file: File): Promise<void> => {
      if (!api) return;
      setNotice(null);
      try {
        const res = await api.readReceipt(file, localToday());
        if (res.draft) addDrafts([res.draft], "receipt");
        else addEmpty("expense");
        if (res.fallback) setNotice({ tone: "info", text: res.draft ? RECEIPT_PARTIAL : RECEIPT_FAILED });
      } catch {
        addEmpty("expense");
        setNotice({ tone: "info", text: RECEIPT_FAILED });
      }
    },
    [api, addDrafts, addEmpty, setNotice],
  );

  return { quickLog, receipt };
}
