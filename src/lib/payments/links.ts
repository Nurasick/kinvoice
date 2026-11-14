/**
 * Pay-button deep links. Owner: Yernur.
 * No payment processing — we only open Venmo/PayPal with the amount prefilled.
 * Venmo format follows https://venmo.com/paymentlinks (txn, recipients, amount, note);
 * PayPal follows the documented paypal.me/<user>/<amount><currency> form.
 */

function dollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Venmo payment link with recipient, amount and note prefilled. */
export function venmoLink(username: string, amountCents: number, note: string): string {
  const params = new URLSearchParams({
    txn: "pay",
    recipients: username.replace(/^@/, ""),
    amount: dollars(amountCents),
    note,
  });
  return `https://venmo.com/?${params.toString()}`;
}

/** PayPal.Me link: paypal.me/<user>/<amount>USD */
export function paypalLink(username: string, amountCents: number): string {
  return `https://www.paypal.me/${encodeURIComponent(username)}/${dollars(amountCents)}USD`;
}
