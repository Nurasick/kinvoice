/**
 * First viewport: the family fridge door. Sarah's real scraps (from the demo seed) are held by magnets,
 * each with a printed label of what Kinvoice reads from it; the invoice Mike opens is pinned on top.
 */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { formatCents } from "@/lib/money";
import { formatDuration, monthName } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import type { LandingCopy } from "./copy";
import { DemoCta } from "./DemoCta";
import { FridgeParallax } from "./FridgeParallax";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { LandingData } from "./landing-data";
import s from "./landing.module.css";

interface HeroProps {
  copy: LandingCopy;
  data: LandingData;
  locale: Locale;
}

export function FridgeHero({ copy, data, locale }: HeroProps) {
  const { hero, fridge } = copy;
  return (
    <section className={`${s.enamel} lg:min-h-[min(54rem,100svh)]`} aria-labelledby="hero-title">
      <div aria-hidden className={`${s.handle} hidden lg:block`} />
      <div className="relative mx-auto max-w-[84rem] px-4 sm:px-8 lg:pr-20">
        <header className="flex items-center justify-between gap-3 py-5">
          <MagnetLogo label={copy.nav.home} />
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={locale} label={copy.nav.language} />
            <a
              href="#try"
              className="hidden text-sm font-semibold underline-offset-4 hover:underline sm:inline"
            >
              {copy.nav.tryDemo}
            </a>
          </div>
        </header>

        <div className="relative pt-6 pb-10 lg:min-h-[37rem] lg:pt-12 lg:pb-12">
          <div className="relative z-10 max-w-[36rem]">
            <h1
              id="hero-title"
              className={`${s.display} text-[2rem] leading-[1.1] font-bold sm:text-[2.75rem] lg:text-[2.9rem]`}
            >
              {hero.title}
            </h1>
            <p className={`${s.onEnamelSoft} mt-6 max-w-[31rem] text-lg leading-relaxed`}>{hero.sub}</p>
            <div id="try" className="mt-8 flex flex-wrap items-start gap-x-2 gap-y-3">
              <DemoCta label={hero.cta} loadingLabel={hero.ctaLoading} errorLabel={hero.ctaError} />
              <Link href="/setup" className={s.btnGhost}>
                {hero.secondary}
              </Link>
            </div>
            <p className={`${s.onEnamelSoft} mt-3 text-sm`}>{hero.note}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[rgb(8_20_60/0.28)] px-4 py-2 text-sm font-medium">
              {hero.price}
            </p>
          </div>

          <div className="mt-14 lg:mt-0">
            <FridgeParallax
              className={s.scene}
              label={fridge.sceneLabel({
                caregiver: data.caregiver.name,
                sibling: data.sibling.name,
                amount: formatCents(data.sibling.suggestedContributionCents),
              })}
            >
              <Receipt copy={copy} data={data} />
              <AppointmentCard copy={copy} data={data} locale={locale} />
              <StickyNote copy={copy} data={data} />
              <InvoiceSheet copy={copy} data={data} locale={locale} />
            </FridgeParallax>
          </div>
        </div>
      </div>
    </section>
  );
}

function MagnetLogo({ label }: { label: string }) {
  return (
    <Link href="/" aria-label={label} className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-full bg-[var(--marigold)] text-[0.95rem] font-bold text-[var(--ink)] shadow-[0_5px_8px_-3px_rgb(8_18_48/0.5)]"
      >
        <span className={s.display}>K</span>
      </span>
      <span className={`${s.display} text-xl font-bold`}>Kinvoice</span>
    </Link>
  );
}

function Pinned({ pos, magnet, children }: { pos: string; magnet: string; children: ReactNode }) {
  return (
    <div className={`${s.item} ${pos}`}>
      <div className={s.drop}>
        <span className={s.magnet} style={{ "--m": magnet } as CSSProperties} />
        {children}
      </div>
    </div>
  );
}

function Tag({ children, className }: { children: ReactNode; className: string }) {
  return <span className={`${s.tag} ${className}`}>{children}</span>;
}

/** Thermal-receipt barcode: bars of varying width, drawn rather than typed. */
const WIDTHS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2];
/** Alternating bar/gap widths → bar rects with their x offsets, computed once. */
const BARS = WIDTHS.map((w, i) => ({
  w,
  x: WIDTHS.slice(0, i).reduce((a, b) => a + b, 0),
  isBar: i % 2 === 0,
})).filter((b) => b.isBar);
const BARCODE_WIDTH = WIDTHS.reduce((a, b) => a + b, 0);

function Barcode() {
  return (
    <svg
      className="mx-auto mt-3 block"
      width={BARCODE_WIDTH * 3}
      height={22}
      viewBox={`0 0 ${BARCODE_WIDTH} 22`}
      preserveAspectRatio="none"
      fill="#3a3f4c"
      aria-hidden
    >
      {BARS.map((b) => (
        <rect key={b.x} x={b.x} y={0} width={b.w} height={22} />
      ))}
    </svg>
  );
}

function Receipt({ copy, data }: { copy: LandingCopy; data: LandingData }) {
  const amount = formatCents(data.pharmacy.amountCents);
  return (
    <Pinned pos={s.posReceipt} magnet="var(--tomato)">
      <div className={`${s.receipt} ${s.mono} ${s.paperShadow}`}>
        <p className="text-center text-[0.8rem] font-semibold tracking-wide">CVS PHARMACY</p>
        <p className="text-center text-[0.65rem] text-[#6b7180]">COLUMBUS OH · #4471</p>
        <div className={`${s.dash} my-2`} />
        <p className="flex justify-between gap-2">
          <span className="truncate">{copy.fridge.receiptItem}</span>
          <span>{amount.replace("$", "")}</span>
        </p>
        <p className="flex justify-between text-[#6b7180]">
          <span>RX · 3</span>
          <span />
        </p>
        <div className={`${s.dash} my-2`} />
        <p className="flex justify-between font-semibold">
          <span>{copy.fridge.receiptTotal}</span>
          <span>{amount}</span>
        </p>
        <Barcode />
      </div>
      <Tag className="-bottom-5 -left-3">
        {copy.fridge.labelMedication} · <b>{amount}</b>
      </Tag>
    </Pinned>
  );
}

function AppointmentCard({ copy, data, locale }: { copy: LandingCopy; data: LandingData; locale: Locale }) {
  return (
    <Pinned pos={s.posCard} magnet="var(--mint)">
      <div className={`${s.card} ${s.paperShadow}`}>
        <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-[#8a3a2a] uppercase">OhioHealth</p>
        <p className={`${s.display} mt-1 text-[0.78rem] font-bold sm:text-base`}>
          {copy.fridge.cardTitle}
        </p>
        <p className="mt-2 text-sm">{copy.fridge.cardWho}</p>
        <p className={`${s.hand} mt-1 text-2xl leading-none text-[#1d3b8a]`}>{copy.fridge.cardWhen}</p>
      </div>
      <Tag className="-bottom-4 -left-3">
        {copy.fridge.labelAppointment} · <b>{formatDuration(data.appointment.minutes, locale)}</b>
      </Tag>
    </Pinned>
  );
}

function StickyNote({ copy, data }: { copy: LandingCopy; data: LandingData }) {
  const amount = formatCents(data.siblingPurchase.amountCents);
  return (
    <Pinned pos={s.posSticky} magnet="var(--enamel-hi)">
      <div className={`${s.sticky} ${s.hand}`}>
        {copy.fridge.sticky({ sibling: data.sibling.name, amount })}
      </div>
      <Tag className="-bottom-4 left-2">
        {copy.fridge.labelSiblingPaid({ sibling: data.sibling.name })} · <b>{amount}</b>
      </Tag>
    </Pinned>
  );
}

function InvoiceSheet({ copy, data, locale }: { copy: LandingCopy; data: LandingData; locale: Locale }) {
  const f = copy.fridge;
  const { caregiver, sibling } = data;
  return (
    <Pinned pos={s.posInvoice} magnet="var(--marigold)">
      <Tag className="-bottom-4 right-4">{f.labelInvoice({ sibling: sibling.name })}</Tag>
      <article className={`${s.invoice} ${s.paperShadow}`}>
        <header className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] pb-3">
          <p className={`${s.display} text-[0.95rem] font-bold`}>
            {f.invoiceTitle({ month: monthName(data.month, locale) })}
          </p>
          <p className="text-xs font-semibold text-[var(--enamel)]">Kinvoice</p>
        </header>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">{f.invoiceGreeting({ sibling: sibling.name })}</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--ink-soft)]">{f.invoiceCosts}</dt>
            <dd className="font-semibold">{formatCents(data.totalOutOfPocketCents)}</dd>
          </div>
          <div className="text-[var(--ink-soft)]">
            {f.invoiceCaregiver({
              caregiver: caregiver.name,
              paid: formatCents(caregiver.paidCents),
              time: formatDuration(caregiver.minutes, locale),
            })}
          </div>
          <div className="text-[var(--ink-soft)]">
            {f.invoiceYouPaid({ paid: formatCents(sibling.paidCents) })}
          </div>
        </dl>
        <div className="mt-4 rounded-xl bg-[var(--mist)] px-4 py-3">
          <p className="text-sm font-medium text-[var(--ink-soft)]">{f.invoiceShare}</p>
          <p className={`${s.display} mt-0.5 text-[2.6rem] leading-none font-bold tracking-tight`}>
            {formatCents(sibling.suggestedContributionCents)}
          </p>
        </div>
        <span className={`${s.payBtn} mt-4`}>{f.invoicePay}</span>
        <p className="mt-2 text-center text-xs text-[var(--ink-faint)]">{f.invoiceFoot}</p>
      </article>
    </Pinned>
  );
}
