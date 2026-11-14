/**
 * Integer-cents helpers. Owner: Nurali.
 * Never do money arithmetic on floats; convert at the edges with these helpers.
 */

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** 8650 → "$86.50" */
export function formatCents(cents: number): string {
  return USD.format(cents / 100);
}

/**
 * "86.5" | "$1,086.50" | "86" → 8650 | 108650 | 8600.
 * Returns null for anything that is not a non-negative amount with at most 2 decimals.
 */
export function parseDollarsToCents(input: string): number | null {
  const cleaned = input.trim().replace(/[$,\s]/g, "");
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const fraction = (match[2] ?? "").padEnd(2, "0");
  return Number(match[1]) * 100 + Number(fraction);
}

/** 150 → "2h 30m", 45 → "45m", 120 → "2h" */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Value of `minutes` at `hourlyRateCents`, rounded half-up to the cent. */
export function timeValueCents(minutes: number, hourlyRateCents: number): number {
  return Math.round((minutes * hourlyRateCents) / 60);
}
