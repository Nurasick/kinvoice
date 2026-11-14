"use client";
import type { Locale } from "@/lib/i18n/locales";
import { formatCents } from "@/lib/money";
import { paypalLink, venmoLink } from "@/lib/payments/links";
import type { PaymentMethod, PublicInvoice } from "@/shared/domain";
import { Button, CopyButton, buttonClass } from "@/components/ui";
import { siblingCopy } from "./copy";

export interface PayOptionsProps {
  invoice: PublicInvoice;
  /** Invoice month in the reader's language. */
  month: string;
  locale: Locale;
  amountCents: number;
  onChoose: (method: PaymentMethod) => void;
  onSent: () => void;
  isSending: boolean;
  error: string | null;
}

/** Deep links into the caregiver's own payment apps (only the ones the caregiver filled in), then "I've sent it". */
export function PayOptions({
  invoice,
  month,
  locale,
  amountCents,
  onChoose,
  onSent,
  isSending,
  error,
}: PayOptionsProps) {
  const { venmo, paypal, zelle } = invoice.caregiverHandles;
  const caregiver = invoice.caregiverName;
  const copy = siblingCopy(locale).pay;
  const note = copy.note({ parent: invoice.parentName, month });
  const hasAny = Boolean(venmo || paypal || zelle);

  return (
    <div className="flex flex-col gap-4">
      {hasAny ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {venmo && (
            <a
              href={venmoLink(venmo, amountCents, note)}
              target="_blank"
              rel="noreferrer"
              onClick={() => onChoose("venmo")}
              className={buttonClass("primary", "lg")}
            >
              {copy.venmo}
            </a>
          )}
          {paypal && (
            <a
              href={paypalLink(paypal, amountCents)}
              target="_blank"
              rel="noreferrer"
              onClick={() => onChoose("paypal")}
              className={buttonClass(venmo ? "secondary" : "primary", "lg")}
            >
              {copy.paypal}
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink-soft">{copy.noHandles({ caregiver })}</p>
      )}
      {zelle && (
        <div className="rounded-[var(--radius-control)] bg-surface px-4 py-3">
          <p className="text-sm font-medium text-ink">{copy.zelleTitle}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {copy.zelleSteps({ amount: formatCents(amountCents), caregiver, handle: zelle })}
          </p>
          <CopyButton
            value={zelle}
            label={copy.copyZelle({ caregiver })}
            size="sm"
            className="mt-2"
            onPointerDown={() => onChoose("zelle")}
          />
        </div>
      )}
      <div className="flex flex-col gap-2 border-t border-accent/20 pt-4">
        <p className="text-sm text-ink-soft">{copy.afterSend({ caregiver })}</p>
        <div>
          <Button variant="secondary" size="lg" onClick={onSent} isLoading={isSending}>
            {copy.sent}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
      <p className="text-xs text-ink-muted">{copy.footnote({ caregiver })}</p>
    </div>
  );
}
