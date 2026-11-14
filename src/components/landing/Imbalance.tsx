/**
 * The problem, shown with the demo family's real month: identical meters side by side,
 * so the imbalance reads in one sweep. Money and time use the same scale across siblings.
 */
import { formatCents } from "@/lib/money";
import { formatDuration } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import type { LandingCopy } from "./copy";
import type { LandingData, LandingMember } from "./landing-data";
import s from "./landing.module.css";

const MIN_VISIBLE = 0.025;

export function Imbalance({ copy, data, locale }: { copy: LandingCopy; data: LandingData; locale: Locale }) {
  const p = copy.problem;
  const maxPaid = Math.max(...data.members.map((m) => m.paidCents), 1);
  const maxMin = Math.max(...data.members.map((m) => m.minutes), 1);
  return (
    <section className="bg-white" aria-labelledby="problem-title">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20 lg:py-28">
        <div>
          <h2 id="problem-title" className={`${s.display} text-3xl leading-tight font-bold sm:text-[2.6rem]`}>
            {p.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--ink-soft)]">{p.body}</p>
          <figure className="mt-10 space-y-6">
            <Stat text={p.statOne} source={p.statOneSource} />
            <Stat text={p.statTwo} source={p.statTwoSource} />
          </figure>
        </div>

        <div role="group" aria-label={p.chartLabel} className="grid grid-cols-3 gap-3 sm:gap-6">
          {data.members.map((m) => (
            <MemberMeter key={m.name} m={m} copy={copy} locale={locale} maxPaid={maxPaid} maxMin={maxMin} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ text, source }: { text: string; source: string }) {
  return (
    <blockquote className="border-t-2 border-[var(--ink)] pt-3">
      <p className="text-base font-semibold">{text}</p>
      <cite className="mt-1 block text-sm text-[var(--ink-faint)] not-italic">{source}</cite>
    </blockquote>
  );
}

interface MeterProps {
  m: LandingMember;
  copy: LandingCopy;
  locale: Locale;
  maxPaid: number;
  maxMin: number;
}

function MemberMeter({ m, copy, locale, maxPaid, maxMin }: MeterProps) {
  const p = copy.problem;
  const isCaregiver = m.role === "caregiver";
  return (
    <div className="min-w-0">
      <p className={`${s.display} text-lg font-bold sm:text-2xl`}>{m.name}</p>
      <p className="mt-1 min-h-[3.75rem] text-xs leading-snug sm:min-h-[2.5rem] text-[var(--ink-faint)] sm:text-sm">
        {isCaregiver ? p.caregiver : p.sibling}
      </p>
      <Meter
        label={p.paid}
        value={m.paidCents === 0 ? p.nothing : formatCents(m.paidCents)}
        ratio={m.paidCents / maxPaid}
        color={isCaregiver ? "var(--enamel)" : "#9fb0dc"}
      />
      <Meter
        label={p.time}
        value={formatDuration(m.minutes, locale)}
        ratio={m.minutes / maxMin}
        color={isCaregiver ? "var(--marigold)" : "#ffd98a"}
      />
    </div>
  );
}

function Meter({
  label,
  value,
  ratio,
  color,
}: {
  label: string;
  value: string;
  ratio: number;
  color: string;
}) {
  return (
    <div className="mt-5">
      <div className="flex flex-col items-start sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-2">
        <span className="text-xs font-medium text-[var(--ink-faint)]">{label}</span>
        <span className="text-sm font-semibold sm:text-base">{value}</span>
      </div>
      <div className={`${s.meterTrack} mt-2`} aria-hidden>
        <div
          className={s.meterFill}
          style={{ height: `${Math.max(ratio, MIN_VISIBLE) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}
