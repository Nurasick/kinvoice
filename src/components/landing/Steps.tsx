/**
 * How it works: three numbered steps, each with the actual artifact at life size
 * (the quick-log box, the filled receipt entry, the sibling's phone).
 */
import type { CSSProperties, ReactNode } from "react";
import { formatCents } from "@/lib/money";
import { formatDuration } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import type { LandingCopy } from "./copy";
import type { LandingData } from "./landing-data";
import s from "./landing.module.css";

export function Steps({ copy, data, locale }: { copy: LandingCopy; data: LandingData; locale: Locale }) {
  const st = copy.steps;
  return (
    <section className="bg-[var(--mist)]" aria-labelledby="steps-title">
      <div className="mx-auto max-w-[84rem] px-4 py-20 sm:px-8 lg:py-28">
        <h2
          id="steps-title"
          className={`${s.display} max-w-3xl text-3xl leading-tight font-bold sm:text-[2.6rem]`}
        >
          {st.title}
        </h2>
        <ol className="mt-14 space-y-16 lg:space-y-24">
          <Step n={1} title={st.one.title} body={st.one.body}>
            <QuickLog copy={copy} data={data} locale={locale} />
          </Step>
          <Step n={2} title={st.two.title} body={st.two.body} flip>
            <ReceiptEntry copy={copy} data={data} />
          </Step>
          <Step n={3} title={st.three.title} body={st.three.body}>
            <SiblingPhone copy={copy} data={data} />
          </Step>
        </ol>
        <p className="mt-16 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">{st.honest}</p>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  body,
  flip = false,
  children,
}: {
  n: number;
  title: string;
  body: string;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
      <div className={flip ? "lg:order-2" : undefined}>
        <span aria-hidden className={s.stepNum}>
          {n}
        </span>
        <h3 className={`${s.display} mt-4 text-2xl font-bold`}>{title}</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]">{body}</p>
      </div>
      <div className={`flex ${flip ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}>{children}</div>
    </li>
  );
}

const panel = "w-full max-w-[28rem] rounded-2xl bg-white p-5 shadow-[0_24px_48px_-28px_rgb(24_47_115/0.45)]";

function QuickLog({ copy, data, locale }: { copy: LandingCopy; data: LandingData; locale: Locale }) {
  const one = copy.steps.one;
  return (
    <div className={panel} aria-hidden>
      <p className="rounded-xl border border-[var(--line)] bg-[var(--mist)] px-4 py-3 text-[0.95rem] leading-relaxed">
        {one.sentence}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Draft label={one.chipExpense} value="$86.00" sub="CVS Pharmacy" dot="var(--enamel)" />
        <Draft
          label={one.chipTime}
          value={formatDuration(data.appointment.minutes, locale)}
          sub="OhioHealth"
          dot="var(--marigold)"
        />
      </div>
      <span className={`${s.payBtn} mt-4`}>{one.confirm}</span>
    </div>
  );
}

function Draft({ label, value, sub, dot }: { label: string; value: string; sub: string; dot: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-faint)]">
        <span className="size-2 rounded-full" style={{ background: dot }} />
        {label}
      </p>
      <p className={`${s.display} mt-1 text-xl font-bold`}>{value}</p>
      <p className="text-xs text-[var(--ink-faint)]">{sub}</p>
    </div>
  );
}

function ReceiptEntry({ copy, data }: { copy: LandingCopy; data: LandingData }) {
  const two = copy.steps.two;
  const rows: [string, string][] = [
    [two.amount, formatCents(data.pharmacy.amountCents)],
    [two.store, data.pharmacy.merchant ?? "CVS Pharmacy"],
    [two.date, data.pharmacy.date],
    [two.category, two.categoryValue],
  ];
  return (
    <div className="flex w-full max-w-[30rem] flex-col items-start gap-5 sm:flex-row sm:gap-4" aria-hidden>
      <div className={`${s.receipt} ${s.mono} ${s.paperShadow} w-36 shrink-0 -rotate-3 text-[0.65rem]`}>
        <span className={s.magnet} style={{ "--m": "var(--tomato)" } as CSSProperties} />
        <p className="text-center font-semibold">CVS PHARMACY</p>
        <div className={`${s.dash} my-1.5`} />
        <p>RX · 3</p>
        <div className={`${s.dash} my-1.5`} />
        <p className="flex justify-between font-semibold">
          <span>TOTAL</span>
          <span>{formatCents(data.pharmacy.amountCents)}</span>
        </p>
      </div>
      <dl className={`${panel} min-w-0 space-y-2.5`}>
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0"
          >
            <dt className="text-sm text-[var(--ink-faint)]">{k}</dt>
            <dd className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
              {v}
              <Check />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SiblingPhone({ copy, data }: { copy: LandingCopy; data: LandingData }) {
  const f = copy.fridge;
  return (
    <div className={s.phone} aria-hidden>
      <div className={s.phoneScreen}>
        <p className="text-xs text-[var(--ink-faint)]">kinvoice.app/i/…</p>
        <p className={`${s.display} mt-3 text-base font-bold`}>{copy.steps.three.phoneTitle}</p>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {f.invoiceGreeting({ sibling: data.sibling.name })}
        </p>
        <div className="mt-4 rounded-xl bg-[var(--mist)] p-3">
          <p className="text-xs font-medium text-[var(--ink-soft)]">{f.invoiceShare}</p>
          <p className={`${s.display} text-3xl font-bold`}>
            {formatCents(data.sibling.suggestedContributionCents)}
          </p>
        </div>
        <span className={`${s.payBtn} mt-3`}>{f.invoicePay}</span>
        <span className="mt-2 flex h-10 items-center justify-center rounded-xl border border-[var(--line)] text-sm font-medium">
          {copy.steps.three.sent}
        </span>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--mint)" />
      <path
        d="m7.5 12.5 3 3 6-6.5"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
