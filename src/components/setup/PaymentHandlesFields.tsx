"use client";
import { Field, Input } from "@/components/ui";

export interface HandleValues {
  venmo: string;
  paypal: string;
  zelle: string;
}

export interface PaymentHandlesFieldsProps {
  values: HandleValues;
  onChange: (key: keyof HandleValues, value: string) => void;
}

/** Venmo / PayPal / Zelle inputs. Used by setup and settings. */
export function PaymentHandlesFields({ values, onChange }: PaymentHandlesFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Venmo username" optional>
        {(p) => (
          <Input
            {...p}
            value={values.venmo}
            onChange={(e) => onChange("venmo", e.target.value)}
            placeholder="@sarah-k"
            maxLength={64}
          />
        )}
      </Field>
      <Field label="PayPal.Me name" optional>
        {(p) => (
          <Input
            {...p}
            value={values.paypal}
            onChange={(e) => onChange("paypal", e.target.value)}
            placeholder="sarahk"
            maxLength={64}
          />
        )}
      </Field>
      <Field label="Zelle email or phone" optional>
        {(p) => (
          <Input
            {...p}
            value={values.zelle}
            onChange={(e) => onChange("zelle", e.target.value)}
            placeholder="sarah@example.com"
            maxLength={128}
          />
        )}
      </Field>
    </div>
  );
}
