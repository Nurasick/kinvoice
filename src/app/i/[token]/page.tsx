// Owner: Yernur. Public sibling view: no key, no login. Rendered on the server from the frozen invoice.
// Language: ?lang, then the remembered cookie, then the browser (same order as the landing). Money stays USD.
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siblingCopy, type SiblingCopy } from "@/components/public-invoice/copy";
import { LocaleSwitch } from "@/components/public-invoice/LocaleSwitch";
import { MonthBreakdown } from "@/components/public-invoice/MonthBreakdown";
import { caregiverBalance, monthYear } from "@/components/public-invoice/public-invoice-view";
import { SettleUp } from "@/components/public-invoice/SettleUp";
import { Card, EmptyState, Money, buttonClass } from "@/components/ui";
import { formatCents } from "@/lib/money";
import { formatDuration } from "@/lib/i18n/format";
import { LOCALE_COOKIE, LOCALE_QUERY, resolveLocale, type Locale } from "@/lib/i18n/locales";
import { getPublicInvoice } from "@/server/services";
import type { PublicInvoice } from "@/shared/domain";

// Private links: never index, never leak the token through the referrer.
const PRIVATE: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = PageProps<"/i/[token]">;

async function currentLocale(searchParams: Props["searchParams"]): Promise<Locale> {
  const [query, jar, h] = await Promise.all([searchParams, cookies(), headers()]);
  return resolveLocale({
    query: query[LOCALE_QUERY],
    cookie: jar.get(LOCALE_COOKIE)?.value,
    acceptLanguage: h.get("accept-language"),
  });
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [invoice, locale] = await Promise.all([load((await params).token), currentLocale(searchParams)]);
  const copy = siblingCopy(locale);
  if (!invoice) return { ...PRIVATE, title: copy.meta.fallbackTitle };
  return {
    ...PRIVATE,
    title: copy.meta.title({ month: monthYear(invoice.month, locale), caregiver: invoice.caregiverName }),
  };
}

export default async function PublicInvoicePage({ params, searchParams }: Props) {
  const [{ token }, query, locale] = await Promise.all([params, searchParams, currentLocale(searchParams)]);
  const invoice = await load(token);
  const forParam = Array.isArray(query.for) ? query.for[0] : query.for;
  if (!invoice) return <InvalidLink copy={siblingCopy(locale)} locale={locale} />;
  return <InvoiceBody token={token} invoice={invoice} preselect={forParam ?? null} locale={locale} />;
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
  locale: Locale;
}

/** The note from the caregiver sits on the enamel band; the sibling's own part comes right after it. */
function InvoiceBody({ token, invoice, preselect, locale }: InvoiceBodyProps) {
  const copy = siblingCopy(locale);
  const month = monthYear(invoice.month, locale);
  const caregiver = caregiverBalance(invoice);
  return (
    <div lang={locale} className="flex flex-1 flex-col">
      <header className="enamel-band">
        <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-24 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <Logo tone="enamel" />
            <LocaleSwitch current={locale} label={copy.header.language} forMember={preselect} />
          </div>
          <p className="mt-10 text-sm font-medium text-on-enamel-soft">
            {copy.header.from({ caregiver: invoice.caregiverName, month })}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-bold text-balance break-words hyphens-auto sm:text-4xl">
            {copy.header.title({ parent: invoice.parentName })}
          </h1>
        </div>
      </header>
      <main className="mx-auto -mt-16 flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pb-16 sm:px-8">
        <Card className="-rotate-[0.6deg]">
          <p className="text-lg leading-relaxed whitespace-pre-line text-ink">{invoice.message}</p>
        </Card>

        <SettleUp token={token} invoice={invoice} month={month} preselect={preselect} locale={locale} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Card tone="flat">
            <p className="text-sm text-ink-muted">{copy.totals.costs}</p>
            <Money
              cents={invoice.snapshot.totalOutOfPocketCents}
              className="mt-1 block font-display text-3xl font-medium"
            />
            {caregiver && (
              <p className="mt-1 text-sm text-ink-muted">
                {copy.totals.caregiverPaid({
                  caregiver: invoice.caregiverName,
                  amount: formatCents(caregiver.paidCents),
                })}
              </p>
            )}
          </Card>
          <Card tone="flat">
            <p className="text-sm text-ink-muted">{copy.totals.time}</p>
            <span className="mt-1 block font-display text-3xl font-medium whitespace-nowrap tabular-nums">
              {formatDuration(invoice.snapshot.totalMinutes, locale)}
            </span>
            <p className="mt-1 text-sm text-ink-muted">
              {copy.totals.timeWorth({ amount: formatCents(invoice.snapshot.totalTimeValueCents) })}
            </p>
          </Card>
        </div>

        <MonthBreakdown invoice={invoice} locale={locale} />
      </main>
    </div>
  );
}

function InvalidLink({ copy, locale }: { copy: SiblingCopy; locale: Locale }) {
  return (
    <div lang={locale} className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 sm:px-8">
        <EmptyState
          className="mt-8"
          title={copy.invalid.title}
          description={copy.invalid.body}
          action={
            <Link href={`/?${LOCALE_QUERY}=${locale}`} className={buttonClass("secondary")}>
              {copy.invalid.cta}
            </Link>
          }
        />
      </main>
    </div>
  );
}
