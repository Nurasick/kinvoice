"use client";
/**
 * Workspace key + this month's entries for the Log page. Owner: Olzhas.
 */
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ApiError, workspaceApi, type WorkspaceApi } from "@/lib/api/client";
import type { Entry, WorkspaceView } from "@/shared/domain";
import { loadWorkspaceKey } from "@/lib/workspace-key";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** undefined while rendering on the server, null when there is no key. */
export function useWorkspaceKey(): string | null | undefined {
  return useSyncExternalStore(subscribe, loadWorkspaceKey, () => undefined);
}

export type LoadState = "loading" | "ready" | "unauthorized" | "error";

export interface LogData {
  api: WorkspaceApi | null;
  view: WorkspaceView | null;
  entries: Entry[];
  state: LoadState;
  reload: () => Promise<void>;
}

type Loaded = { ok: true; view: WorkspaceView; entries: Entry[] } | { ok: false; state: "unauthorized" | "error" };

async function load(api: WorkspaceApi, month: string): Promise<Loaded> {
  try {
    const [view, entries] = await Promise.all([api.getWorkspace(), api.listEntries(month)]);
    return { ok: true, view, entries };
  } catch (err: unknown) {
    return { ok: false, state: err instanceof ApiError && err.status === 401 ? "unauthorized" : "error" };
  }
}

export function useLogData(key: string | null | undefined, month: string): LogData {
  const api = useMemo(() => (key ? workspaceApi(key) : null), [key]);
  const [view, setView] = useState<WorkspaceView | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  const apply = useCallback((result: Loaded) => {
    if (result.ok) {
      setView(result.view);
      setEntries(result.entries);
    }
    setState(result.ok ? "ready" : result.state);
  }, []);

  const reload = useCallback(async () => {
    if (api) apply(await load(api, month));
  }, [api, month, apply]);

  useEffect(() => {
    if (!api) return;
    let live = true;
    load(api, month).then((result) => {
      if (live) apply(result);
    });
    return () => {
      live = false;
    };
  }, [api, month, apply]);

  return { api, view, entries, state: key === null ? "unauthorized" : state, reload };
}
