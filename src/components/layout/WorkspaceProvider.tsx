"use client";
/**
 * Loads the caregiver's edit key + workspace once for every /app page.
 * Pages call `useWorkspace()` to get `{ api, view, refresh }` — no key handling of their own.
 */
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, workspaceApi, type WorkspaceApi } from "@/lib/api/client";
import { clearWorkspaceKey, loadWorkspaceKey } from "@/lib/workspace-key";
import type { Member, WorkspaceView } from "@/shared/domain";
import { Button, EmptyState, LoadingBlock, buttonClass } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { frameCopy } from "./copy";

export interface WorkspaceContextValue {
  editKey: string;
  api: WorkspaceApi;
  view: WorkspaceView;
  caregiver: Member;
  /** Re-fetch the workspace (after settings changes). */
  refresh: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}

type State =
  | { status: "loading" }
  | { status: "missing" }
  /** A stored key the server no longer knows: a mistyped link or a deleted family space. */
  | { status: "rejected" }
  | { status: "error" }
  | { status: "ready"; editKey: string; view: WorkspaceView };

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const { locale } = useLocale();

  const load = useCallback(async (): Promise<void> => {
    const editKey = loadWorkspaceKey();
    if (!editKey) return setState({ status: "missing" });
    try {
      const view = await workspaceApi(editKey).getWorkspace();
      setState({ status: "ready", editKey, view });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearWorkspaceKey();
        return setState({ status: "rejected" });
      }
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    // Initial load reads localStorage, which only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const value = useMemo<WorkspaceContextValue | null>(() => {
    if (state.status !== "ready") return null;
    const caregiver = state.view.members.find((m) => m.role === "caregiver") ?? state.view.members[0];
    return {
      editKey: state.editKey,
      api: workspaceApi(state.editKey),
      view: state.view,
      caregiver,
      refresh: load,
    };
  }, [state, load]);

  if (state.status === "loading") return <LoadingBlock label={frameCopy(locale).workspace.opening} />;
  if (state.status === "missing") return <NoWorkspace />;
  if (state.status === "rejected") return <NoWorkspace rejected />;
  if (state.status === "error" || !value) return <LoadError onRetry={load} />;
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

function NoWorkspace({ rejected = false }: { rejected?: boolean }) {
  const { locale } = useLocale();
  const copy = frameCopy(locale).workspace;
  return (
    <EmptyState
      className="mx-auto mt-10 max-w-lg"
      title={rejected ? copy.rejectedTitle : copy.missingTitle}
      description={rejected ? copy.rejectedBody : copy.missingBody}
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/" className={buttonClass("primary")}>
            {copy.tryDemo}
          </Link>
          <Link href="/setup" className={buttonClass("secondary")}>
            {copy.startOwn}
          </Link>
        </div>
      }
    />
  );
}

function LoadError({ onRetry }: { onRetry: () => Promise<void> }) {
  const { locale } = useLocale();
  const copy = frameCopy(locale).workspace;
  return (
    <EmptyState
      className="mx-auto mt-10 max-w-lg"
      title={copy.errorTitle}
      description={copy.errorBody}
      action={<Button onClick={() => void onRetry()}>{copy.tryAgain}</Button>}
    />
  );
}
