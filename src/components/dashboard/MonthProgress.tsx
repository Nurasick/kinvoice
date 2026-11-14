"use client";
/**
 * "Where am I this month": log → send → settled, with the one next step as the only primary action.
 * Owner: Nurali.
 */
import Link from "next/link";
import type { Invoice } from "@/shared/domain";
import type { SiblingStatus } from "@/components/invoice/invoice-view";
import { publishedLabel } from "@/components/invoice/invoice-view";
import { Badge, Money, buttonClass, cn, type BadgeTone } from "@/components/ui";
import { monthProgress, type StepState } from "./month-progress";

const STATUS: Record<SiblingStatus, { label: string; tone: BadgeTone }> = {
  waiting: { label: "Not yet", tone: "neutral" },
  sent: { label: "Says sent", tone: "warning" },
  received: { label: "Received", tone: "success" },
  covered: { label: "Covered", tone: "success" },
};

export function MonthProgress({
  month,
  entries,
  invoices,
}: {
  month: string;
  entries: number;
  /** Published invoices (all months); the strip picks this month's latest. */
  invoices: readonly Invoice[];
}) {
  const p = monthProgress(entries, invoices, month);
  const invoiceHref = `/app/invoice?month=${month}`;

  return (
    <section
      aria-label="This month's progress"
      className="rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)]"
    >
      <ol className="grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        <Step n={1} state={p.logged.state} title="Log care">
          {p.logged.entries > 0
            ? `${p.logged.entries} ${p.logged.entries === 1 ? "entry" : "entries"} this month`
            : "Nothing logged yet"}
          {p.next === "log" && <Action href="/app/log">Log the first one</Action>}
        </Step>
        <Step n={2} state={p.sent.state} title="Send the invoice">
          {p.sent.invoice ? `Sent ${publishedLabel(p.sent.invoice.publishedAt)}` : "One link per sibling"}
          {p.next === "send" && <Action href={invoiceHref}>Create invoice</Action>}
        </Step>
        <Step n={3} state={p.settled.state} title="Siblings chip in">
          {p.settled.total > 0 ? `${p.settled.settled} of ${p.settled.total} settled` : "After you send it"}
          {p.settled.rows.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {p.settled.rows.map((r) => (
                <li key={r.member.memberId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-ink">
                    {r.member.name} · <Money cents={r.member.suggestedContributionCents} />
                  </span>
                  <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>
                </li>
              ))}
            </ul>
          )}
          {p.next === "follow-up" && (
            <Action href={invoiceHref} quiet>
              Review payments
            </Action>
          )}
          {p.next === "done" && (
            <p className="mt-2 text-sm font-medium text-success">Everyone’s settled. Thank you.</p>
          )}
        </Step>
      </ol>
    </section>
  );
}

function Step({
  n,
  state,
  title,
  children,
}: {
  n: number;
  state: StepState;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn("flex gap-3 p-5", state === "upcoming" && "opacity-60")}
      aria-current={state === "current" ? "step" : undefined}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold",
          state === "done" && "bg-accent text-accent-ink",
          state === "current" && "bg-marigold text-ink",
          state === "upcoming" && "bg-paper-deep text-ink-muted",
        )}
      >
        {state === "done" ? <Tick /> : n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-bold text-ink">{title}</p>
        <div className="mt-0.5 text-sm text-ink-muted">{children}</div>
      </div>
    </li>
  );
}

function Action({
  href,
  children,
  quiet = false,
}: {
  href: string;
  children: React.ReactNode;
  quiet?: boolean;
}) {
  return (
    <Link href={href} className={buttonClass(quiet ? "secondary" : "primary", "sm", "mt-3")}>
      {children}
    </Link>
  );
}

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m6 12.5 4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
