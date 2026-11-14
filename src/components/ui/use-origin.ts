"use client";
import { useSyncExternalStore } from "react";

const subscribe = (): (() => void) => () => {};

/** window.location.origin in the browser, "" during server render. */
export function useOrigin(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => "",
  );
}
