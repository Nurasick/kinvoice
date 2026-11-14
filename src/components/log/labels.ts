/** Human labels for categories. Owner: Olzhas. */
const LABELS: Record<string, string> = {
  medication: "Medication",
  medical: "Medical",
  groceries: "Groceries",
  transport: "Transport",
  household: "Household",
  home_care: "Home care",
  insurance: "Insurance",
  appointments: "Appointments",
  errands: "Errands",
  personal_care: "Personal care",
  companionship: "Companionship",
  admin: "Paperwork & admin",
  other: "Other",
};

export function categoryLabel(category: string): string {
  return LABELS[category] ?? category;
}

/** "2026-11-14" → "Sat, Nov 14" (no timezone shift). */
export function shortDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "2026-11" → "November 2026" */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** Shift "YYYY-MM" by `delta` months. */
export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
