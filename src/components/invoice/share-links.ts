/**
 * Personal share links for each sibling after publishing. Owner: Nurali.
 * The link opens the public invoice straight on that sibling's amount (?for=<memberId>) and in the
 * language the caregiver wrote in (&lang=<locale>, N3). The message is written in that language too.
 * Wording says "suggested contribution", never "owe". Kinvoice sends nothing itself:
 * these open the caregiver's own Messages, WhatsApp or mail app with the text prefilled.
 */
import { DEFAULT_LOCALE, LOCALE_QUERY, type Locale } from "@/lib/i18n/locales";
import { formatCents } from "@/lib/money";

export interface ShareInput {
  origin: string;
  token: string;
  memberId: string;
  siblingName: string;
  caregiverName: string;
  parentName: string;
  /** Month as the reader should see it, already in `locale` ("November 2026", "Ноябрь 2026"). */
  monthName: string;
  amountCents: number;
  email?: string;
  /** The caregiver's UI language; the link and the message follow it. Defaults to English. */
  locale?: Locale;
}

export interface ShareLinks {
  url: string;
  message: string;
  sms: string;
  whatsapp: string;
  email: string;
}

interface MessageParts {
  sibling: string;
  parent: string;
  month: string;
  amount: string;
  url: string;
}

interface ShareCopy {
  greeting: (p: MessageParts) => string;
  ask: (p: MessageParts) => string;
  covered: string;
  closing: (p: MessageParts) => string;
  subject: (p: MessageParts) => string;
}

const COPY: Record<Locale, ShareCopy> = {
  en: {
    greeting: (p) => `Hi ${p.sibling}, here's ${p.parent}'s care for ${p.month}.`,
    ask: (p) => `Your suggested contribution is ${p.amount}.`,
    covered: "You've already covered your share this month, thank you!",
    closing: (p) => `Everything is here, no app needed: ${p.url}`,
    subject: (p) => `${p.parent}'s care, ${p.month}`,
  },
  ru: {
    greeting: (p) => `Привет, ${p.sibling}! Отчёт об уходе за ${p.parent}: ${p.month}.`,
    ask: (p) => `Твой предлагаемый вклад: ${p.amount}.`,
    covered: "Твоя доля в этом месяце уже покрыта, спасибо!",
    closing: (p) => `Всё здесь, без приложения и регистрации: ${p.url}`,
    subject: (p) => `Уход за ${p.parent}: ${p.month}`,
  },
  kk: {
    greeting: (p) => `Сәлем, ${p.sibling}! ${p.parent} күтімінің есебі: ${p.month}.`,
    ask: (p) => `Сізге ұсынылған үлес: ${p.amount}.`,
    covered: "Осы айдағы үлесіңіз толық өтелді, рахмет!",
    closing: (p) => `Барлығы осында, қосымшасыз және тіркелусіз: ${p.url}`,
    subject: (p) => `${p.parent} күтімі: ${p.month}`,
  },
};

export function personalLink(origin: string, token: string, memberId: string, locale?: Locale): string {
  const query = new URLSearchParams({ for: memberId });
  if (locale) query.set(LOCALE_QUERY, locale);
  return `${origin}/i/${encodeURIComponent(token)}?${query.toString()}`;
}

function firstName(parentName: string): string {
  // "Mom (Linda)" reads best as "Mom" in a short text.
  return parentName.replace(/\s*\(.*\)\s*$/, "").trim() || parentName;
}

function partsOf(input: ShareInput, url: string): MessageParts {
  return {
    sibling: input.siblingName,
    parent: firstName(input.parentName),
    month: input.monthName,
    amount: formatCents(input.amountCents),
    url,
  };
}

export function shareMessage(input: ShareInput, url: string): string {
  const copy = COPY[input.locale ?? DEFAULT_LOCALE];
  const p = partsOf(input, url);
  const ask = input.amountCents > 0 ? copy.ask(p) : copy.covered;
  return `${copy.greeting(p)} ${ask} ${copy.closing(p)}`;
}

export function shareLinks(input: ShareInput): ShareLinks {
  const url = personalLink(input.origin, input.token, input.memberId, input.locale);
  const message = shareMessage(input, url);
  const subject = COPY[input.locale ?? DEFAULT_LOCALE].subject(partsOf(input, url));
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
