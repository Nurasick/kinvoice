// Owner: Yernur. Public sibling view: no key, no login. Rendered on the server from the frozen invoice.
import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { monthLabel } from "@/components/log/labels";
import { MonthBreakdown } from "@/components/public-invoice/MonthBreakdown";
import { caregiverBalance } from "@/components/public-invoice/public-invoice-view";
import { SettleUp } from "@/components/public-invoice/SettleUp";
import { Card, Duration, EmptyState, Money, buttonClass } from "@/components/ui";
import { getPublicInvoice } from "@/server/services";
import type { PublicInvoice } from "@/shared/domain";

// Private links: never index, never leak the token through the referrer.
const PRIVATE: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export async function generateMetadata({ params }: PageProps<"/i/[token]">): Promise<Metadata> {
  const invoice = await load((await params).token);
  if (!invoice) return { ...PRIVATE, title: "Kinvoice" };
  return {
    ...PRIVATE,
    title: `${monthLabel(invoice.month)} care update from ${invoice.caregiverName} · Kinvoice`,
  };
}

export default async function PublicInvoicePage({ params, searchParams }: PageProps<"/i/[token]">) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const invoice = await load(token);
  const forParam = Array.isArray(query.for) ? query.for[0] : query.for;
  if (!invoice) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-8">
          <Logo />
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 sm:px-8">
          <InvalidLink />
        </main>
      </div>
    );
  }
  return <InvoiceBody token={token} invoice={invoice} preselect={forParam ?? null} />;
}

/** Any failure (bad token, DB hiccup) shows the calm invalid-link page, never an error page. */
async function load(token: string): Promise<PublicInvoice | null> {
  try {
    return await getPublicInvoice(token);
  } catch {
    return null;
  }
}

interface InvoiceBodyProps {
  token: string;
  invoice: PublicInvoice;
  preselect: string | null;
}

/** The note from the caregiver sits on the enamel band; the sibling's own part comes right after it. */
function InvoiceBody({ token, invoice, preselect }: InvoiceBodyProps) {
  const monthName = monthLabel(invoice.month);
  const caregiver = caregiverBalance(invoice);
  return (
    <div className="flex flex-1 flex-col">
      <header className="enamel-band">
        <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-24 sm:px-8">
          <Logo tone="enamel" />
          <p className="mt-10 text-sm font-medium text-on-enamel-soft">
            From {invoice.caregiverName} · {monthName}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-bold text-balance sm:text-4xl">
            Care update for {invoice.parentName}
          </h1>
        </div>
      </header>
      <main className="mx-auto -mt-16 flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pb-16 sm:px-8">
        <Card className="-rotate-[0.6deg]">
          <p className="text-lg leading-relaxed whitespace-pre-line text-ink">{invoice.message}</p>
        </Card>

        <SettleUp token={token} invoice={invoice} monthName={monthName} preselect={preselect} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Card tone="flat">
            <p className="text-sm text-ink-muted">Care costs this month</p>
            <Money
              cents={invoice.snapshot.totalOutOfPocketCents}
              className="mt-1 block font-display text-3xl font-medium"
            />
            {caregiver && (
              <p className="mt-1 text-sm text-ink-muted">
                {invoice.caregiverName} paid <Money cents={caregiver.paidCents} /> of it.
              </p>
            )}
          </Card>
          <Card tone="flat">
            <p className="text-sm text-ink-muted">Care time given</p>
            <Duration
              minutes={invoice.snapshot.totalMinutes}
              className="mt-1 block font-display text-3xl font-medium"
            />
            <p className="mt-1 text-sm text-ink-muted">
              Worth <Money cents={invoice.snapshot.totalTimeValueCents} />, shown for recognition, not split.
            </p>
          </Card>
        </div>

        <MonthBreakdown invoice={invoice} />
      </main>
    </div>
  );
}

function InvalidLink() {
  return (
    <EmptyState
      className="mt-8"
      title="This invoice link isn’t working"
      description="It may have been mistyped, or the family workspace was deleted. Ask whoever sent it for a fresh link."
      action={
        <Link href="/" className={buttonClass("secondary")}>
          What is Kinvoice?
        </Link>
      }
    />
  );
}
