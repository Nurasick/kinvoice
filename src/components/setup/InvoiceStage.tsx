/**
 * Landing hero illustration: the demo family's real month as three sheets in perspective.
 * Back: what Sarah logged. Middle: what the month adds up to. Front: what Mike opens.
 * Pure CSS 3D (see .stage-* in globals.css); flattens on small screens and for reduced motion.
 */
import type { ReactNode } from "react";
import { formatCents, formatMinutes } from "@/lib/money";
import { cn } from "@/components/ui";
import type { DemoHero } from "./demo-hero-data";

export function InvoiceStage({ hero }: { hero: DemoHero }) {
  const { caregiver, sibling, firstExpense, firstTime } = hero;
  return (
    <figure className="stage mx-auto w-full max-w-[34rem] lg:mr-0 lg:ml-auto" aria-labelledby="stage-caption">
      <figcaption id="stage-caption" className="sr-only">
        Example from the demo family: {caregiver.name} logged {formatCents(firstExpense.amountCents)} at{" "}
        {firstExpense.merchant} and {formatMinutes(firstTime.minutes)} of care. This month she paid{" "}
        {formatCents(caregiver.paidCents)} and gave {formatMinutes(caregiver.minutes)}. {sibling.name}&apos;s
        suggested contribution is {formatCents(sibling.suggestedContributionCents)}.
      </figcaption>
      <div className="stage-scene" aria-hidden>
        <Sheet layer="back" label={`${caregiver.name} logs it`}>
          <p className="font-display text-[0.95rem] leading-snug text-ink-soft italic">
            “Paid {formatCents(firstExpense.amountCents)} at CVS for Mom’s meds, then drove her to the
            cardiologist, {spokenDuration(firstTime.minutes)}.”
          </p>
          <div className="mt-3 flex gap-2 whitespace-nowrap">
            <Chip>
              Medication · <b className="font-medium text-ink">{formatCents(firstExpense.amountCents)}</b>
            </Chip>
            <Chip>
              Appointments · <b className="font-medium text-ink">{formatMinutes(firstTime.minutes)}</b>
            </Chip>
          </div>
        </Sheet>

        <Sheet layer="mid" label="The month adds up">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.15fr_0.75fr_1.1fr]">
            <Figure caption={`${caregiver.name} paid`} value={formatCents(caregiver.paidCents)} />
            <Figure caption={`${caregiver.name} gave`} value={formatMinutes(caregiver.minutes)} />
            <div className="hidden sm:block">
              <Figure caption="Family total" value={formatCents(hero.totalOutOfPocketCents)} muted />
            </div>
          </div>
        </Sheet>

        <Sheet layer="front" label={`What ${sibling.name} opens`}>
          <p className="text-sm text-ink-muted">Your suggested contribution</p>
          <p className="mt-1 font-display text-5xl leading-none font-medium tracking-tight text-ink tabular-nums">
            {formatCents(sibling.suggestedContributionCents)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            An equal share of {formatCents(hero.totalOutOfPocketCents)}, minus the{" "}
            {formatCents(sibling.paidCents)} you already paid for grab bars.
          </p>
          <span className="mt-4 flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent text-sm font-medium text-accent-ink">
            Pay with Venmo
          </span>
        </Sheet>
      </div>
    </figure>
  );
}

function Sheet({
  layer,
  label,
  children,
}: {
  layer: "back" | "mid" | "front";
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("stage-sheet", `stage-sheet--${layer}`)}>
      <p className="mb-3 text-[0.7rem] font-medium tracking-[0.08em] text-accent-strong uppercase">{label}</p>
      {children}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft tabular-nums">
      {children}
    </span>
  );
}

function Figure({ caption, value, muted = false }: { caption: string; value: string; muted?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs whitespace-nowrap text-ink-muted">{caption}</p>
      <p
        className={cn(
          "mt-0.5 font-display font-medium whitespace-nowrap tabular-nums",
          muted ? "text-lg leading-8 text-ink-soft" : "text-2xl text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/** 180 → "3 hours", 90 → "1h 30m": how a person would type it in a quick-log sentence. */
function spokenDuration(minutes: number): string {
  if (minutes % 60 !== 0) return formatMinutes(minutes);
  const hours = minutes / 60;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}
