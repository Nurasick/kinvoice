"use client";
/** One month of entries for the Log page. Owner: Olzhas. Workspace/key come from useWorkspace(). */
import { useCallback, useEffect, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import type { Entry } from "@/shared/domain";

export type EntriesState = "loading" | "ready" | "error";

type Loaded = { ok: true; entries: Entry[] } | { ok: false };

async function load(api: WorkspaceApi, month: string): Promise<Loaded> {
  try {
    return { ok: true, entries: await api.listEntries(month) };
  } catch {
    return { ok: false };
  }
}

export interface EntriesData {
  entries: Entry[];
  state: EntriesState;
  reload: () => Promise<void>;
}

export function useEntries(api: WorkspaceApi, month: string): EntriesData {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [state, setState] = useState<EntriesState>("loading");

  const apply = useCallback((result: Loaded) => {
    if (result.ok) setEntries(result.entries);
    setState(result.ok ? "ready" : "error");
  }, []);

  const reload = useCallback(async () => {
    apply(await load(api, month));
  }, [api, month, apply]);

  useEffect(() => {
    let live = true;
    load(api, month).then((result) => {
      if (live) apply(result);
    });
    return () => {
      live = false;
    };
  }, [api, month, apply]);

  return { entries, state, reload };
}
