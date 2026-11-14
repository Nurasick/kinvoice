/**
 * Small local primitives for the Log page. Owner: Olzhas.
 * Yernur's src/components/ui/** isn't on main yet; swap these for it when it lands.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outside";

const VARIANTS: Record<Variant, string> = {
  /** Ghost button placed on the page background (not in a card) — follows the theme's text color. */
  outside: "text-current opacity-80 hover:opacity-100 hover:bg-current/10 disabled:opacity-30",
  primary: "bg-teal-700 text-white hover:bg-teal-800 disabled:bg-teal-700/50",
  secondary: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 disabled:opacity-50",
  ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-50",
  danger: "text-red-700 hover:bg-red-50 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-stone-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`}>
      <span className="font-medium text-stone-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 tabular-nums outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 aria-[invalid=true]:border-red-500";

export function Spinner({ label }: { label: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-stone-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" aria-hidden />
      {label}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "warn"; children: ReactNode }) {
  const styles = {
    info: "border-stone-200 bg-stone-50 text-stone-700",
    success: "border-teal-200 bg-teal-50 text-teal-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
  }[tone];
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}
