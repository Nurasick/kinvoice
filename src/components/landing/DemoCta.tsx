"use client";
/** Creates a fresh private copy of Sarah's demo family and opens the dashboard. */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publicApi } from "@/lib/api/client";
import { saveWorkspaceKey } from "@/lib/workspace-key";
import s from "./landing.module.css";

interface DemoCtaProps {
  label: string;
  loadingLabel: string;
  errorLabel: string;
  variant?: "primary" | "ink";
}

export function DemoCta({ label, loadingLabel, errorLabel, variant = "primary" }: DemoCtaProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function open(): Promise<void> {
    setIsLoading(true);
    setHasError(false);
    try {
      const { editKey } = await publicApi.createDemo();
      saveWorkspaceKey(editKey);
      router.push("/app");
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => void open()}
        disabled={isLoading}
        aria-busy={isLoading}
        className={variant === "primary" ? s.btnPrimary : s.btnInk}
      >
        {isLoading ? loadingLabel : label}
        {!isLoading && <Arrow />}
      </button>
      {hasError && (
        <p role="alert" className="max-w-xs text-sm font-medium">
          {errorLabel}
        </p>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
