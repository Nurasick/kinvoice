// Owner: Yernur. Landing page: value prop, demo, start your own.
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { TryDemoButton } from "@/components/setup/TryDemoButton";
import { Badge, Card, Money, buttonClass } from "@/components/ui";

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
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-8">
        <Logo />
        <Link href="/setup" className="text-sm font-medium text-ink-soft hover:text-ink">
          Start your own
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-8">
        <section className="grid items-center gap-12 py-10 sm:py-16 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-sm font-medium text-accent">For the sibling who does the caring</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.1] font-medium tracking-tight text-balance sm:text-5xl">
              One clear monthly care invoice for your family.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              You keep track of the pharmacy runs, the copays and the drives. Kinvoice turns them into a kind,
              honest update your siblings can open in one tap, with a suggested contribution for each.
            </p>
            <div className="mt-8 flex flex-wrap items-start gap-3">
              <TryDemoButton />
              <Link href="/setup" className={buttonClass("secondary", "lg")}>
                Start your own
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              No sign-up. The demo is a private copy just for you.
            </p>
          </div>
          <InvoicePreview />
        </section>

        <section aria-labelledby="how" className="border-t border-line py-14">
          <h2 id="how" className="font-display text-2xl font-medium">
            How it works
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="font-display text-sm text-accent tabular-nums">0{i + 1}</span>
                <h3 className="mt-1 font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-5xl px-4 py-6 text-xs text-ink-muted sm:px-8">
          Kinvoice stores amounts, categories and short notes. No medical records, no passwords, no accounts.
        </p>
      </footer>
    </div>
  );
}

/** Illustration of what a sibling receives. Static sample numbers, clearly labelled. */
function InvoicePreview() {
  return (
    <Card aria-label="Example care invoice" className="relative mx-auto w-full max-w-md rotate-[0.6deg]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Mom’s care · November</p>
        <Badge tone="accent">Example</Badge>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Hi both, a quick update on Mom this month. Her new prescription is working well and the grab bars are
        in.
      </p>
      <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-sm text-ink-muted">Care costs this month</span>
        <Money cents={101519} className="font-display text-2xl" />
      </div>
      <ul className="mt-4 flex flex-col gap-2 text-sm">
        <PreviewRow name="Mike" cents={21840} />
        <PreviewRow name="Emily" cents={33839} />
      </ul>
    </Card>
  );
}

function PreviewRow({ name, cents }: { name: string; cents: number }) {
  return (
    <li className="flex items-center justify-between rounded-[var(--radius-control)] bg-paper px-3 py-2">
      <span>
        {name} <span className="text-ink-muted">· suggested contribution</span>
      </span>
      <Money cents={cents} className="font-medium" />
    </li>
  );
}
