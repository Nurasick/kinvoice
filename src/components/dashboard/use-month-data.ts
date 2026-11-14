"use client";
import { useCallback, useEffect, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import type { Entry, MonthlyBalance } from "@/shared/domain";

export type MonthData =
  { state: "loading" } | { state: "error" } | { state: "ready"; balance: MonthlyBalance; entries: Entry[] };

/** Loads the month's balance and entries together; ignores responses for a month no longer shown. */
export function useMonthData(api: WorkspaceApi, month: string): { data: MonthData; reload: () => void } {
  const [data, setData] = useState<MonthData>({ state: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the spinner while the new month loads
    setData({ state: "loading" });
    Promise.all([api.getBalance(month), api.listEntries(month)])
      .then(([balance, entries]) => current && setData({ state: "ready", balance, entries }))
      .catch(() => current && setData({ state: "error" }));
    return () => {
      current = false;
    };
  }, [api, month, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, reload };
}
