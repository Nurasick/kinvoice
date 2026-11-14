/**
 * "Sarah's family" demo seed. Owner: Nurali.
 * Each POST /api/demo creates a fresh private copy, so jury members never see each other's edits.
 * Dates are spread across the current month up to today, so the dashboard always has a full-looking month.
 */
import type { NewEntry } from "@/shared/domain";
import type { CreateWorkspaceInput } from "../repo/types";

type SeedMember = "sarah" | "mike" | "emily";
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type SeedEntry = DistributiveOmit<NewEntry, "memberId" | "date" | "source"> & { who: SeedMember; day: number };

export const DEMO_MEMBERS: ReadonlyArray<{ key: SeedMember } & CreateWorkspaceInput["members"][number]> = [
  { key: "sarah", name: "Sarah", role: "caregiver" },
  { key: "mike", name: "Mike", role: "sibling", email: "mike@example.com" },
  { key: "emily", name: "Emily", role: "sibling", email: "emily@example.com" },
];

export const DEMO_WORKSPACE = {
  parentName: "Mom (Linda)",
  hourlyRateCents: 2500,
  caregiverHandles: { venmo: "sarah-demo", paypal: "sarahdemo", zelle: "sarah@example.com" },
} as const;

/** `day` is a position on a 28-day month; it gets scaled into 1..today. */
const SEED: SeedEntry[] = [
  { who: "sarah", day: 1, kind: "expense", amountCents: 8642, category: "medication", merchant: "CVS Pharmacy", note: "Monthly prescriptions" },
  { who: "sarah", day: 2, kind: "time", minutes: 180, category: "appointments", note: "Cardiologist, drove her there and back" },
  { who: "sarah", day: 3, kind: "expense", amountCents: 12730, category: "groceries", merchant: "Kroger", note: "Weekly groceries" },
  { who: "sarah", day: 5, kind: "expense", amountCents: 4000, category: "medical", merchant: "OhioHealth", note: "Cardiology copay" },
  { who: "sarah", day: 6, kind: "time", minutes: 120, category: "errands", note: "Pharmacy + groceries run" },
  { who: "mike", day: 7, kind: "expense", amountCents: 12000, category: "household", merchant: "Amazon", note: "Shower grab bars" },
  { who: "sarah", day: 8, kind: "expense", amountCents: 3815, category: "transport", merchant: "Shell", note: "Gas for appointment drives" },
  { who: "sarah", day: 10, kind: "time", minutes: 240, category: "personal_care", note: "Helped with bathing, laundry, meal prep" },
  { who: "sarah", day: 11, kind: "expense", amountCents: 11865, category: "groceries", merchant: "Kroger", note: "Groceries + supplements" },
  { who: "emily", day: 12, kind: "time", minutes: 60, category: "admin", note: "Sorted out Medicare Part D paperwork by phone" },
  { who: "sarah", day: 13, kind: "expense", amountCents: 24000, category: "home_care", merchant: "Comfort Keepers", note: "Home aide, 2 afternoons" },
  { who: "sarah", day: 15, kind: "time", minutes: 150, category: "companionship", note: "Sunday lunch and a walk" },
  { who: "sarah", day: 16, kind: "expense", amountCents: 2399, category: "medication", merchant: "Walgreens", note: "OTC pain relief, vitamins" },
  { who: "sarah", day: 18, kind: "expense", amountCents: 6500, category: "household", merchant: "Handyman", note: "Fixed the porch railing" },
  { who: "sarah", day: 20, kind: "time", minutes: 90, category: "admin", note: "Bills, insurance claim, pill organizer" },
  { who: "sarah", day: 21, kind: "expense", amountCents: 9418, category: "groceries", merchant: "Kroger", note: "Groceries" },
  { who: "sarah", day: 23, kind: "expense", amountCents: 3500, category: "medical", merchant: "Riverside Lab", note: "Blood work copay" },
  { who: "sarah", day: 24, kind: "time", minutes: 180, category: "appointments", note: "Lab + primary care follow-up" },
  { who: "mike", day: 25, kind: "time", minutes: 45, category: "companionship", note: "Video call with Mom" },
  { who: "sarah", day: 27, kind: "expense", amountCents: 2650, category: "transport", merchant: "Uber", note: "Ride home from PT" },
];

function isoDay(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Entries for the month containing `today`, attributed to real member ids. */
export function buildDemoEntries(today: Date, memberIds: Record<SeedMember, string>): NewEntry[] {
  const todayDay = today.getDate();
  return SEED.map(({ who, day, ...rest }) => ({
    ...rest,
    memberId: memberIds[who],
    date: isoDay(today.getFullYear(), today.getMonth(), Math.max(1, Math.ceil((day * todayDay) / 28))),
    source: "manual",
  }) as NewEntry);
}
