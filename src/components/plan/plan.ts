/**
 * The caregiver plan and the monthly reminder. Pure, no I/O.
 * Pricing (PRODUCT.md): siblings free, caregiver $5.99/month, first month free.
 * Checkout is test mode only: Kinvoice charges no card yet.
 */

export const TRIAL_DAYS = 30;
export const PLAN_PRICE_CENTS = 599;
const DAY_MS = 86_400_000;
const ICS_LINE_OCTETS = 73;

/** Whole days left in the free month, counted from when the family space was created. */
export function trialDaysLeft(createdAtIso: string, now: Date): number {
  const created = Date.parse(createdAtIso);
  if (Number.isNaN(created)) return TRIAL_DAYS;
  const elapsed = Math.max(0, Math.floor((now.getTime() - created) / DAY_MS));
  return Math.max(0, TRIAL_DAYS - elapsed);
}

/** "YYYY-MM" of the month after `month`. */
export function nextMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const year = m === 12 ? y + 1 : y;
  const mon = m === 12 ? 1 : m + 1;
  return `${year}-${String(mon).padStart(2, "0")}`;
}

/** The first day of the month after `now`, as "YYYYMMDD" (calendar date, no time zone). */
export function nextFirstOfMonth(now: Date): string {
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${nextMonth(month).replace("-", "")}01`;
}

export interface ReminderInput {
  title: string;
  description: string;
  url: string;
  /** "YYYYMMDD" of the first reminder. */
  startDate: string;
  uid: string;
  now: Date;
}

/** An iCalendar file with an all-day event on the 1st of every month and a 9:00 alert. */
export function monthlyReminderIcs(input: ReminderInput): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kinvoice//Care invoice reminder//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${utcStamp(input.now)}`,
    `DTSTART;VALUE=DATE:${input.startDate}`,
    `DTEND;VALUE=DATE:${dayAfter(input.startDate)}`,
    "RRULE:FREQ=MONTHLY;BYMONTHDAY=1",
    `SUMMARY:${escapeText(input.title)}`,
    `DESCRIPTION:${escapeText(`${input.description}\n${input.url}`)}`,
    `URL:${input.url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:PT9H",
    `DESCRIPTION:${escapeText(input.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function dayAfter(yyyymmdd: string): string {
  const d = new Date(Date.UTC(+yyyymmdd.slice(0, 4), +yyyymmdd.slice(4, 6) - 1, +yyyymmdd.slice(6, 8) + 1));
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** RFC 5545 folding: lines over 75 octets continue on the next line after a space. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  for (const ch of line) {
    if (encoder.encode(current + ch).length > ICS_LINE_OCTETS) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.join("\r\n ");
}
