"use client";
/**
 * The sibling's part: pick yourself, see your suggested contribution, pay through the caregiver's
 * own Venmo / PayPal / Zelle, then say "I've sent it". Kinvoice never touches the money.
 */
import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api/client";
import type { PaymentMark, PaymentMethod, PublicInvoice } from "@/shared/domain";
import { Card, Money, cn } from "@/components/ui";
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
  monthName,
}: {
  token: string;
  invoice: PublicInvoice;
  monthName: string;
}) {
  const list = siblings(invoice);
  const [memberId, setMemberId] = useState<string | null>(() => initialSibling(invoice, null));
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
        <h2 className="font-display text-xl font-medium">Your part this month</h2>
        <p className="mt-1 text-sm text-ink-soft">Tap your name to see your suggested contribution.</p>
        <div role="radiogroup" aria-label="Who is reading" className="mt-3 flex flex-wrap gap-2">
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
          monthName={monthName}
          member={{ id: me.memberId, name: me.name, cents: me.suggestedContributionCents }}
          payment={payment}
          onMarked={(mark) =>
            setPayments((prev) => [...prev.filter((p) => p.memberId !== mark.memberId), mark])
          }
        />
      )}
    </Card>
  );
}

interface MyContributionProps {
  token: string;
  invoice: PublicInvoice;
  monthName: string;
  member: { id: string; name: string; cents: number };
  payment: PaymentMark | undefined;
  onMarked: (mark: PaymentMark) => void;
}

function MyContribution({ token, invoice, monthName, member, payment, onMarked }: MyContributionProps) {
  const [method, setMethod] = useState<PaymentMethod>("other");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const caregiver = invoice.caregiverName;

  if (member.cents === 0) {
    return (
      <Status title="You’ve already covered your share this month." body={`Thank you, ${member.name}.`} />
    );
  }
  if (payment?.status === "received") {
    return <Status title={`${caregiver} confirmed it arrived.`} body="Thank you for chipping in." />;
  }

  async function markSent(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      onMarked(await publicApi.markSent(token, { memberId: member.id, amountCents: member.cents, method }));
    } catch {
      setError(`That didn’t go through. Please try again, or just let ${caregiver} know.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 border-t border-accent/20 pt-5">
      <div>
        <p className="text-sm text-ink-soft">{member.name}, your suggested contribution</p>
        <Money cents={member.cents} className="font-display text-5xl font-medium tracking-tight" />
      </div>
      {payment?.status === "sent" ? (
        <Status
          title={`You marked it as sent. ${caregiver} will confirm when it arrives.`}
          body="Nothing else to do. Thank you."
        />
      ) : (
        <PayOptions
          invoice={invoice}
          monthName={monthName}
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
