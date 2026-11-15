/** Plan (paywall, test checkout) and monthly-rhythm copy in English, Russian and Kazakh. */
import type { Locale } from "@/lib/i18n/locales";

export interface PlanCopy {
  plan: {
    title: string;
    name: string;
    perMonth: string;
    trialLeft: (p: { days: number }) => string;
    trialOver: string;
    features: string[];
    siblingsFree: string;
    start: string;
    checkoutTitle: string;
    card: string;
    expiry: string;
    cvc: string;
    testNote: string;
    subscribe: (p: { price: string }) => string;
    back: string;
    active: string;
    activeBody: (p: { price: string }) => string;
    cancel: string;
  };
  rhythm: {
    settledTitle: (p: { month: string; next: string }) => string;
    title: string;
    body: string;
    remind: string;
    reminderTitle: (p: { parent: string }) => string;
    reminderBody: string;
    planLine: (p: { days: number; price: string }) => string;
    planActive: string;
    planLink: string;
  };
}

const en: PlanCopy = {
  plan: {
    title: "Your plan",
    name: "Kinvoice for caregivers",
    perMonth: "a month",
    trialLeft: ({ days }) => `Free month: ${days} ${days === 1 ? "day" : "days"} left`,
    trialOver: "Your free month has ended. Subscribe to keep sending invoices.",
    features: [
      "Unlimited entries, receipts and AI drafts",
      "A monthly invoice link for every sibling",
      "Venmo, PayPal and Zelle buttons with the amount filled in",
    ],
    siblingsFree: "Your siblings never pay and never need an account.",
    start: "Start subscription",
    checkoutTitle: "Checkout",
    card: "Card number",
    expiry: "Expiry",
    cvc: "CVC",
    testNote: "Test mode: this is a demo checkout with a test card. No card is charged.",
    subscribe: ({ price }) => `Subscribe · ${price} a month`,
    back: "Not now",
    active: "Active (test mode)",
    activeBody: ({ price }) => `Renews monthly at ${price}. Cancel anytime.`,
    cancel: "Cancel subscription",
  },
  rhythm: {
    settledTitle: ({ month, next }) => `${month} is settled. ${next} starts fresh.`,
    title: "Your monthly rhythm",
    body: "Log things as they happen. On the 1st, review the month and send one invoice.",
    remind: "Add a monthly reminder to my calendar",
    reminderTitle: ({ parent }) => `Send the care invoice for ${parent}`,
    reminderBody: "Review last month in Kinvoice, then send each sibling their link.",
    planLine: ({ days, price }) => `Free month: ${days} days left, then ${price} a month`,
    planActive: "Plan active (test mode)",
    planLink: "Your plan",
  },
};

const ru: PlanCopy = {
  plan: {
    title: "Ваш тариф",
    name: "Kinvoice для ухаживающих",
    perMonth: "в месяц",
    trialLeft: ({ days }) => `Бесплатный месяц: осталось ${days} дн.`,
    trialOver: "Бесплатный месяц закончился. Оформите подписку, чтобы и дальше отправлять счета.",
    features: [
      "Без ограничений: записи, чеки и черновики от ИИ",
      "Ежемесячная ссылка на счёт для каждого брата и сестры",
      "Кнопки Venmo, PayPal и Zelle с уже указанной суммой",
    ],
    siblingsFree: "Братья и сёстры никогда не платят, и аккаунт им не нужен.",
    start: "Оформить подписку",
    checkoutTitle: "Оплата",
    card: "Номер карты",
    expiry: "Срок",
    cvc: "CVC",
    testNote: "Тестовый режим: демо-оплата тестовой картой. Деньги не списываются.",
    subscribe: ({ price }) => `Подписаться · ${price} в месяц`,
    back: "Не сейчас",
    active: "Активна (тестовый режим)",
    activeBody: ({ price }) => `Продлевается ежемесячно за ${price}. Отменить можно в любой момент.`,
    cancel: "Отменить подписку",
  },
  rhythm: {
    settledTitle: ({ month, next }) => `${month}: все рассчитались. ${next} начинается с чистого листа.`,
    title: "Ваш ритм на месяц",
    body: "Записывайте расходы по ходу дела. Первого числа проверьте месяц и отправьте один счёт.",
    remind: "Добавить ежемесячное напоминание в календарь",
    reminderTitle: ({ parent }) => `Отправить счёт за уход: ${parent}`,
    reminderBody: "Проверьте прошлый месяц в Kinvoice и отправьте каждому его ссылку.",
    planLine: ({ days, price }) => `Бесплатный месяц: осталось ${days} дн., затем ${price} в месяц`,
    planActive: "Подписка активна (тестовый режим)",
    planLink: "Ваш тариф",
  },
};

const kk: PlanCopy = {
  plan: {
    title: "Сіздің тарифіңіз",
    name: "Күтім жасаушыларға арналған Kinvoice",
    perMonth: "айына",
    trialLeft: ({ days }) => `Тегін ай: ${days} күн қалды`,
    trialOver: "Тегін ай аяқталды. Шот жіберуді жалғастыру үшін жазылыңыз.",
    features: [
      "Шексіз жазбалар, чектер және ЖИ жобалары",
      "Әр бауырға ай сайынғы шот сілтемесі",
      "Сомасы толтырылған Venmo, PayPal және Zelle батырмалары",
    ],
    siblingsFree: "Бауырларыңыз ешқашан төлемейді, оларға аккаунт керек емес.",
    start: "Жазылу",
    checkoutTitle: "Төлем",
    card: "Карта нөмірі",
    expiry: "Мерзімі",
    cvc: "CVC",
    testNote: "Сынақ режимі: сынақ картасымен демо төлем. Ақша алынбайды.",
    subscribe: ({ price }) => `Жазылу · айына ${price}`,
    back: "Қазір емес",
    active: "Белсенді (сынақ режимі)",
    activeBody: ({ price }) => `Ай сайын ${price} бойынша жаңарады. Кез келген уақытта тоқтатуға болады.`,
    cancel: "Жазылымды тоқтату",
  },
  rhythm: {
    settledTitle: ({ month, next }) => `${month}: бәрі есептесті. ${next} жаңадан басталады.`,
    title: "Айлық ырғағыңыз",
    body: "Шығындарды болған кезде жазып отырыңыз. Айдың 1-інде айды тексеріп, бір шот жіберіңіз.",
    remind: "Күнтізбеге ай сайынғы еске салғыш қосу",
    reminderTitle: ({ parent }) => `Күтім шотын жіберу: ${parent}`,
    reminderBody: "Kinvoice-та өткен айды тексеріп, әр бауырға өз сілтемесін жіберіңіз.",
    planLine: ({ days, price }) => `Тегін ай: ${days} күн қалды, кейін айына ${price}`,
    planActive: "Жазылым белсенді (сынақ режимі)",
    planLink: "Сіздің тарифіңіз",
  },
};

const COPY: Record<Locale, PlanCopy> = { en, ru, kk };

export function planCopy(locale: Locale): PlanCopy {
  return COPY[locale];
}
