/**
 * Personal share links for each sibling after publishing. Owner: Nurali.
 * The link opens the public invoice straight on that sibling's amount (?for=<memberId>).
 * Wording says "suggested contribution", never "owe". Kinvoice sends nothing itself:
 * these open the caregiver's own Messages, WhatsApp or mail app with the text prefilled.
 */
import { formatCents } from "@/lib/money";

export interface ShareInput {
  origin: string;
  token: string;
  memberId: string;
  siblingName: string;
  caregiverName: string;
  parentName: string;
  monthName: string;
  amountCents: number;
  email?: string;
}

export interface ShareLinks {
  url: string;
  message: string;
  sms: string;
  whatsapp: string;
  email: string;
}

export function personalLink(origin: string, token: string, memberId: string): string {
  return `${origin}/i/${encodeURIComponent(token)}?for=${encodeURIComponent(memberId)}`;
}

function firstName(parentName: string): string {
  // "Mom (Linda)" reads best as "Mom" in a short text.
  return parentName.replace(/\s*\(.*\)\s*$/, "").trim() || parentName;
}

export function shareMessage(input: ShareInput, url: string): string {
  const parent = firstName(input.parentName);
  const ask =
    input.amountCents > 0
      ? `Your suggested contribution is ${formatCents(input.amountCents)}.`
      : "You've already covered your share this month, thank you!";
  return `Hi ${input.siblingName}, here's ${parent}'s care for ${input.monthName}. ${ask} Everything is here, no app needed: ${url}`;
}

export function shareLinks(input: ShareInput): ShareLinks {
  const url = personalLink(input.origin, input.token, input.memberId);
  const message = shareMessage(input, url);
  const subject = `${firstName(input.parentName)}'s care, ${input.monthName}`;
  const text = encodeURIComponent(message);
  return {
    url,
    message,
    // "sms:?&body=" opens Messages with the body on both iOS and Android.
    sms: `sms:?&body=${text}`,
    whatsapp: `https://wa.me/?text=${text}`,
    email: `mailto:${input.email ? encodeURIComponent(input.email) : ""}?subject=${encodeURIComponent(subject)}&body=${text}`,
  };
}
