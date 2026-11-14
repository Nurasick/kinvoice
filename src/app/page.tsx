// Owner: Yernur. Landing page: value prop, the real demo month in the hero, demo + start your own.
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { InvoiceStage } from "@/components/setup/InvoiceStage";
import { TryDemoButton } from "@/components/setup/TryDemoButton";
import { demoHero } from "@/components/setup/demo-hero-data";
import { buttonClass } from "@/components/ui";

const STEPS = [
  {
    title: "Log it in one sentence",
    body: "“Paid $86 at CVS for Mom’s meds, then drove her to the cardiologist, 3 hours.” Kinvoice turns it into entries you confirm.",
  },
  {
    title: "See the month clearly",
    body: "What care cost, who paid, and who gave time. Every split is plain arithmetic, never a guess.",
  },
  {
    title: "Send one calm link",
    body: "Your siblings open it with no account, see where the money went, and chip in with Venmo, PayPal or Zelle.",
  },
] as const;

export default function Home() {
  const hero = demoHero();
  return (
    <div className="flex flex-1 flex-col overflow-x-clip">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <Logo />
        <Link href="/setup" className="text-sm font-medium text-ink-soft hover:text-ink">
          Start your own
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8">
        <section className="grid items-center gap-14 pt-8 pb-16 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pb-24">
          <div className="max-w-xl">
            <h1 className="font-display text-[2.6rem] leading-[1.04] font-medium tracking-[-0.025em] text-balance sm:text-6xl">
              One clear monthly care invoice for your family.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-soft">
              You keep track of the pharmacy runs, the copays and the drives. Kinvoice turns them into a kind,
              honest update your siblings open in one tap, with a suggested contribution for each.
            </p>
            <div className="mt-9 flex flex-wrap items-start gap-3">
              <TryDemoButton />
              <Link href="/setup" className={buttonClass("secondary", "lg")}>
                Start your own
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              No sign-up. The demo opens {hero.caregiver.name}’s real month as a private copy, just for you.
            </p>
          </div>
          <InvoiceStage hero={hero} />
        </section>

        <section aria-labelledby="how" className="border-t border-line py-14">
          <h2 id="how" className="font-display text-2xl font-medium">
            How it works
          </h2>
          <ol className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong font-display text-sm text-accent-strong"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-ink-muted sm:px-8">
          Kinvoice stores amounts, categories and short notes. No medical records, no passwords, no accounts.
        </p>
      </footer>
    </div>
  );
}
