import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** "flat" drops the shadow (cards inside cards); "accent" is the sage highlight. */
  tone?: "raised" | "flat" | "accent";
}

const TONES: Record<NonNullable<CardProps["tone"]>, string> = {
  raised: "bg-surface border border-line shadow-[var(--shadow-card)]",
  flat: "bg-surface border border-line",
  accent: "bg-accent-soft border border-accent/20",
};

export function Card({ tone = "raised", className, ...rest }: CardProps) {
  return <div className={cn("rounded-[var(--radius-card)] p-5 sm:p-6", TONES[tone], className)} {...rest} />;
}

export interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned slot (a button, a badge…). */
  action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
