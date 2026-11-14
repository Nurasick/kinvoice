import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export const controlClass: string = cn(
  "w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 text-sm text-ink",
  "placeholder:text-ink-muted transition-colors",
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40",
  "disabled:cursor-not-allowed disabled:bg-paper-deep disabled:text-ink-muted",
  "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/20",
);

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps) {
  return <input className={cn(controlClass, "h-10", className)} {...rest} />;
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 4, ...rest }: TextareaProps) {
  return <textarea rows={rows} className={cn(controlClass, "py-2 leading-relaxed", className)} {...rest} />;
}
