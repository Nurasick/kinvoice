"use client";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "./Button";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** Text placed on the clipboard. */
  value: string;
  label?: string;
  /** Confirmation shown for two seconds after copying. Default English "Copied". */
  copiedLabel?: string;
}

/** Copies `value` and confirms with "Copied" for two seconds. Fails soft (button just stays as is). */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  variant = "secondary",
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard blocked: the text is still visible for manual copying.
    }
  }

  return (
    <Button variant={variant} onClick={() => void copy()} aria-live="polite" {...rest}>
      {copied ? copiedLabel : label}
    </Button>
  );
}
