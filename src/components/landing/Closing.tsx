/** Pricing, privacy and the closing call to action, back on the fridge enamel. */
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatCents } from "@/lib/money";
import type { LandingCopy } from "./copy";
import type { LandingData } from "./landing-data";
import { DemoCta } from "./DemoCta";
import s from "./landing.module.css";

export function Pricing({ copy }: { copy: LandingCopy }) {
  const pr = copy.pricing;
  return (
    <section className={s.enamel} aria-labelledby="pricing-title">
      <div className="relative mx-auto grid max-w-[84rem] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-20 lg:py-28">
        <div>
          <h2
            id="pricing-title"
            className={`${s.display} max-w-xl text-3xl leading-tight font-bold sm:text-[2.6rem]`}
          >
            {pr.title}
          </h2>
          <div className="mt-10 max-w-md rounded-2xl bg-[rgb(8_20_60/0.28)] p-6">
            <p className={`${s.display} text-lg font-bold`}>{pr.siblingsTitle}</p>
            <p className={`${s.onEnamelSoft} mt-2 leading-relaxed`}>{pr.siblingsBody}</p>
          </div>
        </div>

        <article className={`${s.invoice} ${s.paperShadow} relative -rotate-1 p-7 sm:p-8`}>
          <span
            aria-hidden
            className={s.magnet}
            style={{ ["--m" as string]: "var(--tomato)", animation: "none" }}
          />
          <h3 className={`${s.display} text-lg font-bold`}>{pr.plan}</h3>
          <p className="mt-3 flex items-baseline gap-2">
            <span className={`${s.display} text-6xl font-bold tracking-tight`}>$5.99</span>
            <span className="text-[var(--ink-soft)]">{pr.perMonth}</span>
          </p>
          <p className="mt-2 inline-flex rounded-full bg-[#e3f6ee] px-3 py-1 text-sm font-semibold text-[#1d6b52]">
            {pr.firstMonth}
          </p>
          <ul className="mt-6 space-y-3">
            {pr.features.map((f) => (
              <li key={f} className="flex gap-3 text-[0.95rem] leading-snug">
                <Tick />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/setup" className={`${s.btnInk} mt-8 w-full`}>
            {pr.cta}
          </Link>
          <p className="mt-3 text-center text-sm text-[var(--ink-faint)]">{pr.note}</p>
        </article>
      </div>
    </section>
  );
}

export function TrustAndClose({ copy, data }: { copy: LandingCopy; data: LandingData }) {
  const t = copy.trust;
  return (
    <>
      <section className="bg-white" aria-labelledby="trust-title">
        <div className="mx-auto max-w-[84rem] px-4 py-20 sm:px-8 lg:py-24">
          <h2
            id="trust-title"
            className={`${s.display} max-w-2xl text-3xl leading-tight font-bold sm:text-[2.4rem]`}
          >
            {t.title}
          </h2>
          <ul className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-3">
            {t.points.map((pt) => (
              <li key={pt.title} className="border-t-2 border-[var(--ink)] pt-4">
                <p className="text-lg font-semibold">{pt.title}</p>
                <p className="mt-1 leading-relaxed text-[var(--ink-soft)]">{pt.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-[var(--mist)]" aria-labelledby="close-title">
        <div className="mx-auto flex max-w-[84rem] flex-col items-start gap-6 px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <h2
            id="close-title"
            className={`${s.display} max-w-2xl text-3xl leading-tight font-bold sm:text-[2.6rem]`}
          >
            {copy.close.title}
          </h2>
          <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:gap-12">
            <ThankYouNote copy={copy} data={data} />
            <DemoCta
              label={copy.close.cta}
              loadingLabel={copy.hero.ctaLoading}
              errorLabel={copy.hero.ctaError}
              variant="ink"
            />
          </div>
        </div>
      </section>
      <footer className="bg-[var(--enamel-deep)] text-[var(--on-enamel-soft)]">
        <p className="mx-auto max-w-[84rem] px-4 py-8 text-sm sm:px-8">{copy.footer.line}</p>
      </footer>
    </>
  );
}

function Tick() {
  return (
    <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--mist)" />
      <path
        d="m7.5 12.5 3 3 6-6.5"
        stroke="var(--enamel)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The end of the story: the sibling's note back to the caregiver, pinned like everything else. */
function ThankYouNote({ copy, data }: { copy: LandingCopy; data: LandingData }) {
  const text = copy.close.note({
    caregiver: data.caregiver.name,
    amount: formatCents(data.sibling.suggestedContributionCents),
  });
  return (
    <figure className={`${s.sticky} ${s.hand} ${s.paperShadow} mt-3 max-w-[15rem] rotate-2 sm:mt-0`}>
      <span aria-hidden className={s.magnet} style={{ "--m": "var(--marigold)" } as CSSProperties} />
      <p>{text}</p>
      <figcaption className="mt-1 text-right">— {data.sibling.name}</figcaption>
    </figure>
  );
}
