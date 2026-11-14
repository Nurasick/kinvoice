/**
 * Splitting money into equal integer-cent shares. Owner: Nurali.
 */

/**
 * Split `totalCents` into `parts` integer shares that sum exactly to `totalCents`.
 * Leftover cents go to the first shares (callers put the caregiver first,
 * so siblings are never rounded up).
 *
 * splitEqually(1000, 3) → [334, 333, 333]
 */
export function splitEqually(totalCents: number, parts: number): number[] {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new RangeError(`totalCents must be a non-negative integer, got ${totalCents}`);
  }
  if (!Number.isInteger(parts) || parts <= 0) {
    throw new RangeError(`parts must be a positive integer, got ${parts}`);
  }
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents % parts;
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
}
