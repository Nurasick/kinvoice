"use client";
/**
 * The sibling's part: pick yourself, see your suggested contribution, pay through the caregiver's
 * own Venmo / PayPal / Zelle, then say "I've sent it". Kinvoice never touches the money.
 */
import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/locales";
import type { PaymentMark, PaymentMethod, PublicInvoice } from "@/shared/domain";
import { Card, Money, cn } from "@/components/ui";
import { siblingCopy } from "./copy";
import { initialSibling, paymentFor, siblings } from "./public-invoice-view";
import { PayOptions } from "./PayOptions";

const storageKey = (token: string): string => `kinvoice.me.${token.slice(0, 12)}`;

function remembered(token: string): string | null {
  try {
    return window.localStorage.getItem(storageKey(token));
  } catch {
    return null;
  }
}

function remember(token: string, memberId: string): void {
  try {
    window.localStorage.setItem(storageKey(token), memberId);
  } catch {
    // Storage blocked: they just pick their name again next time.
  }
}

export function SettleUp({
  token,
  invoice,
  month,
  preselect = null,
  locale,
}: {
  token: string;
  invoice: PublicInvoice;
  /** Invoice month, already in the reader's language. */
  month: string;
  locale: Locale;
  /** Member id from a personal link (?for=…); opens straight on that sibling's amount. */
  preselect?: string | null;
}) {
  const list = siblings(invoice);
  const copy = siblingCopy(locale).settle;
  const [memberId, setMemberId] = useState<string | null>(() => initialSibling(invoice, preselect));
  const [payments, setPayments] = useState<PaymentMark[]>(invoice.payments);

  useEffect(() => {
    // localStorage only exists in the browser, so the remembered choice is applied after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMemberId((current) => current ?? initialSibling(invoice, remembered(token)));
  }, [invoice, token]);

  function choose(id: string): void {
    setMemberId(id);
    remember(token, id);
  }

  const me = list.find((m) => m.memberId === memberId) ?? null;
  const payment = me ? paymentFor({ ...invoice, payments }, me.memberId) : undefined;

  return (
    <Card tone="accent" className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl font-medium">{copy.title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{me ? copy.notYou : copy.pick}</p>
        <div role="radiogroup" aria-label={copy.whoIsReading} className="mt-3 flex flex-wrap gap-2">
          {list.map((m) => (
            <button
              key={m.memberId}
              type="button"
              role="radio"
              aria-checked={m.memberId === memberId}
              onClick={() => choose(m.memberId)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                m.memberId === memberId
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line-strong bg-surface text-ink hover:border-accent",
              )}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
      {me && (
        <MyContribution
          key={me.memberId}
          token={token}
          invoice={invoice}
          month={month}
          locale={locale}
          member={{ id: me.memberId, name: me.name, cents: me.suggestedContributionCents }}
          payment={payment}
          onMarked={(mark) =>
            setPayments((prev) => [...prev.filter((p) => p.memberId !== mark.memberId), mark])
          }
        />
      )}
      {me && (
        <p className="border-t border-accent/20 pt-4 text-sm text-ink-soft">
          {copy.paidYourself({ caregiver: invoice.caregiverName })}
        </p>
      )}
    </Card>
  );
}

interface MyContributionProps {
  token: string;
  invoice: PublicInvoice;
  month: string;
  locale: Locale;
  member: { id: string; name: string; cents: number };
  payment: PaymentMark | undefined;
  onMarked: (mark: PaymentMark) => void;
}

function MyContribution({ token, invoice, month, locale, member, payment, onMarked }: MyContributionProps) {
  const [method, setMethod] = useState<PaymentMethod>("other");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const caregiver = invoice.caregiverName;
  const copy = siblingCopy(locale).settle;

  if (member.cents === 0) {
    return <Status title={copy.coveredTitle} body={copy.coveredBody({ name: member.name })} />;
  }
  if (payment?.status === "received") {
    return <Status title={copy.receivedTitle({ caregiver })} body={copy.receivedBody} />;
  }

  async function markSent(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      onMarked(await publicApi.markSent(token, { memberId: member.id, amountCents: member.cents, method }));
    } catch {
      setError(copy.sendError({ caregiver }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 border-t border-accent/20 pt-5">
      <div>
        <p className="text-sm text-ink-soft">{copy.yourSuggested({ name: member.name })}</p>
        <Money cents={member.cents} className="font-display text-5xl font-medium tracking-tight" />
      </div>
      {payment?.status === "sent" ? (
        <Status title={copy.sentTitle({ caregiver })} body={copy.sentBody} />
      ) : (
        <PayOptions
          invoice={invoice}
          month={month}
          locale={locale}
          amountCents={member.cents}
          onChoose={setMethod}
          onSent={() => void markSent()}
          isSending={busy}
          error={error}
        />
      )}
    </div>
  );
}

function Status({ title, body }: { title: string; body: string }) {
  return (
    <div role="status" className="rounded-[var(--radius-control)] bg-surface px-4 py-3">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-0.5 text-sm text-ink-muted">{body}</p>
    </div>
  );
}
