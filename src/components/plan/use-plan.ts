"use client";
/**
 * Test-mode subscription state, kept on this device per family space. Kinvoice charges no card
 * yet (PRODUCT.md), so the checkout only records that the caregiver subscribed in test mode.
 */
import { useCallback, useSyncExternalStore } from "react";

const EVENT = "kinvoice-plan";
const keyFor = (workspaceId: string): string => `kinvoice.plan.${workspaceId}`;

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(workspaceId: string): boolean {
  try {
    return window.localStorage.getItem(keyFor(workspaceId)) === "active";
  } catch {
    return false;
  }
}

export interface PlanState {
  isActive: boolean;
  setActive: (active: boolean) => void;
}

export function usePlan(workspaceId: string): PlanState {
  const isActive = useSyncExternalStore(
    subscribe,
    () => read(workspaceId),
    () => false,
  );
  const setActive = useCallback(
    (active: boolean) => {
      try {
        if (active) window.localStorage.setItem(keyFor(workspaceId), "active");
        else window.localStorage.removeItem(keyFor(workspaceId));
      } catch {
        // Private mode without storage: the state just doesn't persist.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [workspaceId],
  );
  return { isActive, setActive };
}
