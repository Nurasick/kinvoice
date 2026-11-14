"use client";
/**
 * Quick log + receipt → draft cards. Owner: Olzhas.
 * Any AI failure opens a manual card (prefilled where possible) — never an error page.
 */
import { useCallback } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import { logCopy, type LogCopy } from "./copy";
import { localToday } from "./draft-form";
import type { DraftsState } from "./use-drafts";

export function useAiActions(api: WorkspaceApi, drafts: DraftsState, t: LogCopy = logCopy("en")) {
  const { addDrafts, addEmpty, setNotice } = drafts;
  const n = t.notice;

  /** Returns true when the text box can be cleared. */
  const quickLog = useCallback(
    async (text: string): Promise<boolean> => {
      setNotice(null);
      try {
        const res = await api.quickLog({ text, today: localToday() });
        if (res.drafts.length > 0) addDrafts(res.drafts, "quick_log");
        else addEmpty("expense", text);
        if (res.fallback) setNotice({ tone: "info", text: n.quickFallback });
      } catch {
        addEmpty("expense", text);
        setNotice({ tone: "info", text: n.aiDown });
      }
      return true;
    },
    [api, addDrafts, addEmpty, setNotice, n],
  );

  const receipt = useCallback(
    async (file: File): Promise<void> => {
      setNotice(null);
      try {
        const res = await api.readReceipt(file, localToday());
        if (res.draft) addDrafts([res.draft], "receipt");
        else addEmpty("expense");
        if (res.fallback) setNotice({ tone: "info", text: res.draft ? n.receiptPartial : n.receiptFailed });
      } catch {
        addEmpty("expense");
        setNotice({ tone: "info", text: n.receiptFailed });
      }
    },
    [api, addDrafts, addEmpty, setNotice, n],
  );

  return { quickLog, receipt };
}
