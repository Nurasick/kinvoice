"use client";
/** Settings → Your plan: the paywall with a test-mode checkout. No real card is charged. */
import { useState, useSyncExternalStore } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { useLocale } from "@/lib/i18n/client";
import { formatCents } from "@/lib/money";
import { Badge, Button, Card } from "@/components/ui";
import { planCopy } from "./copy";
import { PLAN_PRICE_CENTS, trialDaysLeft } from "./plan";
import { usePlan } from "./use-plan";

const TEST_CARD = { number: "4242 4242 4242 4242", expiry: "12 / 34", cvc: "123" };
const noSubscribe = (): (() => void) => () => {};

export function PlanCard() {
  const { view } = useWorkspace();
  const { locale } = useLocale();
  const t = planCopy(locale).plan;
  const { isActive, setActive } = usePlan(view.workspace.id);
  const [isCheckout, setCheckout] = useState(false);
  const days = useSyncExternalStore(
    noSubscribe,
    () => trialDaysLeft(view.workspace.createdAt, new Date()),
    () => trialDaysLeft(view.workspace.createdAt, new Date(view.workspace.createdAt)),
  );
  const price = formatCents(PLAN_PRICE_CENTS);

  return (
    <Card id="plan">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium">{t.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t.name}</p>
        </div>
        {isActive ? (
          <Badge tone="success">{t.active}</Badge>
        ) : (
          <Badge tone="neutral">{days > 0 ? t.trialLeft({ days }) : t.trialOver}</Badge>
        )}
      </div>
      <p className="mt-4 font-display text-4xl font-bold">
        {price} <span className="font-sans text-base font-normal text-ink-muted">{t.perMonth}</span>
      </p>
      <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm text-ink-soft">
        {t.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-soft">{t.siblingsFree}</p>
      {isActive ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm text-ink-soft">{t.activeBody({ price })}</p>
          <Button variant="ghost" size="sm" onClick={() => setActive(false)}>
            {t.cancel}
          </Button>
        </div>
      ) : isCheckout ? (
        <TestCheckout
          price={price}
          onSubscribe={() => {
            setActive(true);
            setCheckout(false);
          }}
          onBack={() => setCheckout(false)}
        />
      ) : (
        <Button className="mt-5" onClick={() => setCheckout(true)}>
          {t.start}
        </Button>
      )}
    </Card>
  );
}

interface TestCheckoutProps {
  price: string;
  onSubscribe: () => void;
  onBack: () => void;
}

function TestCheckout({ price, onSubscribe, onBack }: TestCheckoutProps) {
  const { locale } = useLocale();
  const t = planCopy(locale).plan;
  const field = "mt-1 w-full rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2 font-mono text-sm";
  return (
    <form
      className="mt-5 rounded-[var(--radius-control)] border border-line p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubscribe();
      }}
    >
      <h3 className="font-display text-base font-medium">{t.checkoutTitle}</h3>
      <p className="mt-1 text-sm text-ink-soft">{t.testNote}</p>
      <label className="mt-3 block text-sm font-medium">
        {t.card}
        <input className={field} value={TEST_CARD.number} readOnly />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">
          {t.expiry}
          <input className={field} value={TEST_CARD.expiry} readOnly />
        </label>
        <label className="block text-sm font-medium">
          {t.cvc}
          <input className={field} value={TEST_CARD.cvc} readOnly />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit">{t.subscribe({ price })}</Button>
        <Button type="button" variant="ghost" onClick={onBack}>
          {t.back}
        </Button>
      </div>
    </form>
  );
}
