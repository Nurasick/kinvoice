"use client";
import { paypalLink, venmoLink, zelleInstructions } from "@/lib/payments/links";
import type { PaymentMethod, PublicInvoice } from "@/shared/domain";
import { Button, CopyButton, buttonClass } from "@/components/ui";
import { payNote } from "./public-invoice-view";

export interface PayOptionsProps {
  invoice: PublicInvoice;
  monthName: string;
  amountCents: number;
  onChoose: (method: PaymentMethod) => void;
  onSent: () => void;
  isSending: boolean;
  error: string | null;
}

/** Deep links into the caregiver's own payment apps (only the ones the caregiver filled in), then "I've sent it". */
export function PayOptions({
  invoice,
  monthName,
  amountCents,
  onChoose,
  onSent,
  isSending,
  error,
}: PayOptionsProps) {
  const { venmo, paypal, zelle } = invoice.caregiverHandles;
  const caregiver = invoice.caregiverName;
  const note = payNote(invoice.parentName, monthName);
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
              Pay with Venmo
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
              Pay with PayPal
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink-soft">Send it to {caregiver} however you usually do.</p>
      )}
      {zelle && (
        <div className="rounded-[var(--radius-control)] bg-surface px-4 py-3">
          <p className="text-sm font-medium text-ink">Prefer Zelle?</p>
          <p className="mt-1 text-sm text-ink-soft">{zelleInstructions(zelle, amountCents, caregiver)}</p>
          <CopyButton
            value={zelle}
            label={`Copy ${caregiver}’s Zelle`}
            size="sm"
            className="mt-2"
            onPointerDown={() => onChoose("zelle")}
          />
        </div>
      )}
      <div className="flex flex-col gap-2 border-t border-accent/20 pt-4">
        <p className="text-sm text-ink-soft">Once you’ve sent it, let {caregiver} know with one tap.</p>
        <div>
          <Button variant="secondary" size="lg" onClick={onSent} isLoading={isSending}>
            I’ve sent it
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
      <p className="text-xs text-ink-muted">
        Kinvoice never handles money. Payments go straight to {caregiver} through the app you choose.
      </p>
    </div>
  );
}
