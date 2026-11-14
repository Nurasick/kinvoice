/**
 * Wording of the deterministic invoice message, per language. Owner: Olzhas.
 * Numbers arrive pre-formatted from lib/money; this file only places them.
 */
import type { InvoiceTone } from "@/shared/domain";
import type { Locale } from "@/lib/i18n/locales";

/** Everything a tone needs, already formatted. `sum` is null in an empty month. */
export interface MessageParts {
  greeting: string;
  month: string;
  parent: string;
  sum: string | null;
  ask: string;
  caregiver: string;
}

export interface TemplateCopy {
  hi: (siblings: readonly string[]) => string;
  totals: (money: string | null, time: string | null) => string | null;
  ask: (list: string) => string;
  noAsk: string;
  tones: Record<InvoiceTone, (p: MessageParts) => string>;
}

function joinParts(parts: readonly (string | null)[], and: string): string | null {
  const present = parts.filter((p): p is string => p !== null);
  return present.length > 0 ? present.join(` ${and} `) : null;
}

const en: TemplateCopy = {
  hi: (s) => (s.length === 1 ? `Hi ${s[0]}` : s.length === 2 ? `Hi ${s[0]} and ${s[1]}` : "Hi everyone"),
  totals: (money, time) => joinParts([money && `${money} out of pocket`, time && `${time} of care time`], "and"),
  ask: (list) => `Suggested contribution — ${list}.`,
  noAsk: "No contributions are suggested this month.",
  tones: {
    brief: (p) => `${p.month} care for ${p.parent}${p.sum ? `: ${p.sum}` : ""}. ${p.ask} Details below. — ${p.caregiver}`,
    direct: (p) =>
      `Here is ${p.parent}'s care summary for ${p.month}.${p.sum ? ` This month: ${p.sum}. Costs are split equally.` : ""} ${p.ask} You can use the buttons below. Thanks, ${p.caregiver}`,
    warm: (p) =>
      `${p.greeting}, here's how ${p.month} went with ${p.parent}.${p.sum ? ` Between appointments, groceries and everything in between, this month came to ${p.sum}.` : ""} ${p.ask} Thank you for being part of this. Love, ${p.caregiver}`,
  },
};

const ru: TemplateCopy = {
  hi: (s) => (s.length === 1 ? `Привет, ${s[0]}` : s.length === 2 ? `Привет, ${s[0]} и ${s[1]}` : "Привет всем"),
  totals: (money, time) => joinParts([money && `${money} расходов`, time && `${time} ухода`], "и"),
  ask: (list) => `Предлагаемый вклад — ${list}.`,
  noAsk: "В этом месяце вклад не предлагается.",
  tones: {
    brief: (p) => `${p.month}, ${p.parent}${p.sum ? `: ${p.sum}` : ""}. ${p.ask} Подробности ниже. — ${p.caregiver}`,
    direct: (p) =>
      `Итоги ухода (${p.parent}), месяц: ${p.month}.${p.sum ? ` Всего: ${p.sum}. Расходы делятся поровну.` : ""} ${p.ask} Кнопки для перевода — ниже. Спасибо, ${p.caregiver}`,
    warm: (p) =>
      `${p.greeting}! Рассказываю, как прошёл месяц (${p.month}) — ${p.parent}.${p.sum ? ` Врачи, продукты и всё остальное — всего ${p.sum}.` : ""} ${p.ask} Спасибо, что вы рядом. С любовью, ${p.caregiver}`,
  },
};

const kk: TemplateCopy = {
  hi: (s) => (s.length === 1 ? `Сәлем, ${s[0]}` : s.length === 2 ? `Сәлем, ${s[0]} және ${s[1]}` : "Барлығыңа сәлем"),
  totals: (money, time) => joinParts([money && `${money} шығын`, time && `${time} күтім`], "және"),
  ask: (list) => `Ұсынылған үлес — ${list}.`,
  noAsk: "Бұл айда үлес ұсынылмайды.",
  tones: {
    brief: (p) => `${p.month}, ${p.parent}${p.sum ? `: ${p.sum}` : ""}. ${p.ask} Толығырақ төменде. — ${p.caregiver}`,
    direct: (p) =>
      `${p.parent}: ${p.month} айындағы күтім қорытындысы.${p.sum ? ` Барлығы: ${p.sum}. Шығындар тең бөлінеді.` : ""} ${p.ask} Аудару батырмалары төменде. Рахмет, ${p.caregiver}`,
    warm: (p) =>
      `${p.greeting}! ${p.parent} — ${p.month} айы қалай өткенін айтайын.${p.sum ? ` Дәрігерлер, азық-түлік және басқасы — барлығы ${p.sum}.` : ""} ${p.ask} Қасымда болғандарың үшін рахмет. Сүйіспеншілікпен, ${p.caregiver}`,
  },
};

export const TEMPLATE_COPY: Record<Locale, TemplateCopy> = { en, ru, kk };
