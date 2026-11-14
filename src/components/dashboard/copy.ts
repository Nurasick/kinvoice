/**
 * Dashboard copy in English, Russian and Kazakh. Owner: Yernur.
 * Rules: "suggested contribution", never "owe". Amounts arrive formatted (USD).
 * Russian avoids gendered past-tense verbs about family members.
 */
import { monthLabel } from "@/components/log/labels";
import type { Locale } from "@/lib/i18n/locales";

type Fn<P> = (p: P) => string;

export type PaymentLabel = "notYet" | "saysSent" | "received" | "covered";

export interface DashboardCopy {
  screen: {
    caringFor: Fn<{ parent: string }>;
    loading: Fn<{ month: string }>;
    errorTitle: string;
    errorBody: string;
    tryAgain: string;
    emptyTitle: Fn<{ month: string }>;
    emptyBody: string;
  };
  headline: {
    label: string;
    lead: Fn<{ name: string; pct: number; total: string }>;
    noCosts: string;
    stillToCome: string;
    suggested: string;
    sent: string;
    notSent: string;
    everyoneSettled: string;
    nobodyYet: string;
    someSettled: Fn<{ settled: number; total: number }>;
    newCosts: string;
  };
  progress: {
    label: string;
    status: Record<PaymentLabel, string>;
    logTitle: string;
    entries: Fn<{ n: number }>;
    nothingLogged: string;
    logFirst: string;
    sendTitle: string;
    sentOn: Fn<{ date: string }>;
    oneLink: string;
    createInvoice: string;
    settleTitle: string;
    settledOf: Fn<{ settled: number; total: number }>;
    afterSend: string;
    review: string;
    allSettled: string;
  };
  members: {
    title: string;
    moneyPaid: string;
    timeGiven: string;
    footnote: Fn<{ value: string; rate: string }>;
    caregiver: string;
    sibling: string;
    meterMoney: Fn<{ name: string }>;
    meterTime: Fn<{ name: string }>;
    meterValue: Fn<{ pct: number }>;
    received: string;
    saysSent: string;
    notPaid: string;
    carrying: string;
    covered: string;
    suggested: string;
  };
  categories: {
    title: string;
    money: string;
    time: string;
    noExpenses: string;
    noTime: string;
    byCategory: Fn<{ title: string }>;
  };
  recent: { title: string; logged: Fn<{ n: number }>; openLog: string; someone: string };
}

const INTL_TAG: Record<Locale, string> = { en: "en-US", ru: "ru-RU", kk: "kk-KZ" };

/** Picks the plural form for `n` in `locale` ("1 запись", "2 записи", "5 записей"). */
export function plural(
  locale: Locale,
  n: number,
  forms: Partial<Record<Intl.LDMLPluralRule, string>>,
): string {
  const rule = new Intl.PluralRules(INTL_TAG[locale]).select(n);
  return forms[rule] ?? forms.other ?? "";
}

/**
 * "2026-11-14T09:00:00Z" → "Nov 14, 2026" / "14 нояб. 2026 г." / "14 қараша 2026" in the reader's language.
 * Kazakh is spelled out: browsers ship no Kazakh date names, so Intl alone prints "M11".
 */
export function dateLabel(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (locale === "kk") {
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const [name, year] = monthLabel(month, "kk").split(" ");
    return `${d.getDate()} ${name.toLowerCase()} ${year}`;
  }
  return d.toLocaleDateString(INTL_TAG[locale], { month: "short", day: "numeric", year: "numeric" });
}

const en: DashboardCopy = {
  screen: {
    caringFor: ({ parent }) => `Caring for ${parent}`,
    loading: ({ month }) => `Loading ${month}`,
    errorTitle: "We couldn't load this month",
    errorBody: "Your data is safe. This is usually a brief connection hiccup.",
    tryAgain: "Try again",
    emptyTitle: ({ month }) => `Nothing logged for ${month} yet`,
    emptyBody:
      "Type one sentence like “Paid $86 at CVS for Mom’s meds, then drove her to the cardiologist, 3 hours.” and Kinvoice does the rest.",
  },
  headline: {
    label: "This month in one sentence",
    lead: ({ name, pct, total }) => `${name} covered ${pct}% of the ${total} in care costs this month.`,
    noCosts: "No care costs logged this month yet.",
    stillToCome: "Still to come:",
    suggested: "Suggested contributions:",
    sent: "Invoice sent",
    notSent: "Invoice not sent yet",
    everyoneSettled: "everyone has settled",
    nobodyYet: "nobody has chipped in yet",
    someSettled: ({ settled, total }) => `${settled} of ${total} settled`,
    newCosts: "new costs logged since you sent it",
  },
  progress: {
    label: "This month's progress",
    status: { notYet: "Not yet", saysSent: "Says sent", received: "Received", covered: "Covered" },
    logTitle: "Log care",
    entries: ({ n }) => `${n} ${n === 1 ? "entry" : "entries"} this month`,
    nothingLogged: "Nothing logged yet",
    logFirst: "Log the first one",
    sendTitle: "Send the invoice",
    sentOn: ({ date }) => `Sent ${date}`,
    oneLink: "One link per sibling",
    createInvoice: "Create invoice",
    settleTitle: "Siblings chip in",
    settledOf: ({ settled, total }) => `${settled} of ${total} settled`,
    afterSend: "After you send it",
    review: "Review payments",
    allSettled: "Everyone’s settled. Thank you.",
  },
  members: {
    title: "Who gave what",
    moneyPaid: "Money paid",
    timeGiven: "Time given",
    footnote: ({ value, rate }) =>
      `Costs are split equally. Care time is worth ${value} at ${rate}/hr, shown for recognition and never added to a contribution.`,
    caregiver: "Caregiver",
    sibling: "Sibling",
    meterMoney: ({ name }) => `${name}, money paid`,
    meterTime: ({ name }) => `${name}, time given`,
    meterValue: ({ pct }) => `${pct}% of this month's total`,
    received: "Received",
    saysSent: "Says it’s sent",
    notPaid: "Not paid yet",
    carrying: "Carrying this month",
    covered: "Covered their share",
    suggested: "Suggested contribution",
  },
  categories: {
    title: "Where it went",
    money: "Money",
    time: "Time",
    noExpenses: "No expenses this month.",
    noTime: "No care time logged this month.",
    byCategory: ({ title }) => `${title} by category`,
  },
  recent: {
    title: "Recent entries",
    logged: ({ n }) => `${n} logged this month`,
    openLog: "Open log →",
    someone: "Someone",
  },
};

const ru: DashboardCopy = {
  screen: {
    caringFor: ({ parent }) => `Уход за ${parent}`,
    loading: ({ month }) => `Загружаем ${month}`,
    errorTitle: "Не удалось загрузить этот месяц",
    errorBody: "Ваши данные в сохранности. Обычно это кратковременный сбой связи.",
    tryAgain: "Попробовать ещё раз",
    emptyTitle: ({ month }) => `${month}: пока ничего не записано`,
    emptyBody:
      "Напишите одно предложение, например «Заплатила $86 в CVS за мамины лекарства, потом отвезла её к кардиологу, 3 часа», и Kinvoice сделает остальное.",
  },
  headline: {
    label: "Месяц в одном предложении",
    lead: ({ name, pct, total }) => `${pct}% из ${total} расходов на уход в этом месяце оплачено: ${name}.`,
    noCosts: "В этом месяце расходов на уход пока нет.",
    stillToCome: "Ещё ожидается:",
    suggested: "Предлагаемый вклад:",
    sent: "Счёт отправлен",
    notSent: "Счёт ещё не отправлен",
    everyoneSettled: "все рассчитались",
    nobodyYet: "переводов пока нет",
    someSettled: ({ settled, total }) => `рассчитались ${settled} из ${total}`,
    newCosts: "после отправки появились новые расходы",
  },
  progress: {
    label: "Как идёт месяц",
    status: { notYet: "Ещё нет", saysSent: "Отмечен перевод", received: "Получено", covered: "Доля покрыта" },
    logTitle: "Учёт ухода",
    entries: ({ n }) =>
      `${n} ${plural("ru", n, { one: "запись", few: "записи", many: "записей", other: "записи" })} в этом месяце`,
    nothingLogged: "Пока ничего не записано",
    logFirst: "Записать первое",
    sendTitle: "Отправить счёт",
    sentOn: ({ date }) => `Отправлен ${date}`,
    oneLink: "Каждому своя ссылка",
    createInvoice: "Создать счёт",
    settleTitle: "Братья и сёстры вносят вклад",
    settledOf: ({ settled, total }) => `Рассчитались: ${settled} из ${total}`,
    afterSend: "После отправки",
    review: "Проверить переводы",
    allSettled: "Все рассчитались. Спасибо.",
  },
  members: {
    title: "Кто что внёс",
    moneyPaid: "Оплачено",
    timeGiven: "Время ухода",
    footnote: ({ value, rate }) =>
      `Расходы делятся поровну. Время ухода оценено в ${value} по ${rate}/ч: это для признания, к вкладу оно не добавляется.`,
    caregiver: "Ухаживает",
    sibling: "Брат или сестра",
    meterMoney: ({ name }) => `${name}: оплачено`,
    meterTime: ({ name }) => `${name}: время ухода`,
    meterValue: ({ pct }) => `${pct}% от итога месяца`,
    received: "Получено",
    saysSent: "Отмечен перевод",
    notPaid: "Ещё не переведено",
    carrying: "Основная нагрузка",
    covered: "Доля покрыта",
    suggested: "Предлагаемый вклад",
  },
  categories: {
    title: "Куда ушли деньги и время",
    money: "Деньги",
    time: "Время",
    noExpenses: "В этом месяце расходов нет.",
    noTime: "Время ухода в этом месяце не записано.",
    byCategory: ({ title }) => `${title} по категориям`,
  },
  recent: {
    title: "Последние записи",
    logged: ({ n }) =>
      `${n} ${plural("ru", n, { one: "запись", few: "записи", many: "записей", other: "записи" })} за месяц`,
    openLog: "Открыть учёт →",
    someone: "Кто-то",
  },
};

const kk: DashboardCopy = {
  screen: {
    caringFor: ({ parent }) => `${parent} күтімі`,
    loading: ({ month }) => `${month} жүктелуде`,
    errorTitle: "Бұл айды жүктеу мүмкін болмады",
    errorBody: "Деректеріңіз сақтаулы. Әдетте бұл байланыстың қысқа үзілісі.",
    tryAgain: "Қайта көру",
    emptyTitle: ({ month }) => `${month}: әзірге ештеңе жазылмаған`,
    emptyBody:
      "«CVS-те анамның дәрісіне $86 төледім, содан соң оны кардиологқа апардым, 3 сағат» сияқты бір сөйлем жазыңыз, қалғанын Kinvoice жасайды.",
  },
  headline: {
    label: "Ай бір сөйлемде",
    lead: ({ name, pct, total }) => `Осы айдағы ${total} күтім шығынының ${pct}% бөлігін ${name} төледі.`,
    noCosts: "Осы айда күтім шығыны әлі жоқ.",
    stillToCome: "Әлі күтілуде:",
    suggested: "Ұсынылған үлес:",
    sent: "Шот жіберілді",
    notSent: "Шот әлі жіберілмеді",
    everyoneSettled: "бәрі есеп айырысты",
    nobodyYet: "әзірге аударым жоқ",
    someSettled: ({ settled, total }) => `есеп айырысқандар: ${settled}/${total}`,
    newCosts: "жіберілгеннен кейін жаңа шығындар қосылды",
  },
  progress: {
    label: "Айдың барысы",
    status: {
      notYet: "Әлі жоқ",
      saysSent: "Аударым белгіленді",
      received: "Алынды",
      covered: "Үлесі өтелген",
    },
    logTitle: "Күтімді жазу",
    entries: ({ n }) => `Осы айда ${n} жазба`,
    nothingLogged: "Әзірге ештеңе жазылмаған",
    logFirst: "Алғашқысын жазу",
    sendTitle: "Шотты жіберу",
    sentOn: ({ date }) => `Жіберілді: ${date}`,
    oneLink: "Әр бауырға жеке сілтеме",
    createInvoice: "Шот жасау",
    settleTitle: "Бауырлар үлес қосады",
    settledOf: ({ settled, total }) => `Есеп айырысқандар: ${settled}/${total}`,
    afterSend: "Жібергеннен кейін",
    review: "Аударымдарды қарау",
    allSettled: "Бәрі есеп айырысты. Рақмет.",
  },
  members: {
    title: "Кім не қосты",
    moneyPaid: "Төленген ақша",
    timeGiven: "Берілген уақыт",
    footnote: ({ value, rate }) =>
      `Шығын тең бөлінеді. Күтім уақыты сағатына ${rate} бойынша ${value} деп бағаланады: бұл құрмет үшін, үлеске қосылмайды.`,
    caregiver: "Күтуші",
    sibling: "Бауыр",
    meterMoney: ({ name }) => `${name}: төленген ақша`,
    meterTime: ({ name }) => `${name}: берілген уақыт`,
    meterValue: ({ pct }) => `Айдың жалпы сомасының ${pct}%`,
    received: "Алынды",
    saysSent: "Аударым белгіленді",
    notPaid: "Әлі аударылмады",
    carrying: "Негізгі жүк",
    covered: "Үлесі өтелген",
    suggested: "Ұсынылған үлес",
  },
  categories: {
    title: "Ақша мен уақыт неге кетті",
    money: "Ақша",
    time: "Уақыт",
    noExpenses: "Осы айда шығын жоқ.",
    noTime: "Осы айда күтім уақыты жазылмаған.",
    byCategory: ({ title }) => `Санаттар бойынша: ${title}`,
  },
  recent: {
    title: "Соңғы жазбалар",
    logged: ({ n }) => `Осы айда ${n} жазба`,
    openLog: "Жазбаларды ашу →",
    someone: "Біреу",
  },
};

const COPY: Record<Locale, DashboardCopy> = { en, ru, kk };

export function dashboardCopy(locale: Locale): DashboardCopy {
  return COPY[locale];
}
