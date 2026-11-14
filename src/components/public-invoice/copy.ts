/**
 * Sibling page copy (/i/[token]) in English, Russian and Kazakh. Owner: Yernur.
 * Rules: "suggested contribution", never "owe". Amounts arrive already formatted (USD).
 * Russian avoids gendered past-tense verbs about the caregiver (we don't know who they are).
 */
import type { Locale } from "@/lib/i18n/locales";

type Fn<P> = (p: P) => string;

export interface SiblingCopy {
  meta: { title: Fn<{ month: string; caregiver: string }>; fallbackTitle: string };
  header: { from: Fn<{ caregiver: string; month: string }>; title: Fn<{ parent: string }>; language: string };
  settle: {
    title: string;
    pick: string;
    notYou: string;
    whoIsReading: string;
    yourSuggested: Fn<{ name: string }>;
    coveredTitle: string;
    coveredBody: Fn<{ name: string }>;
    receivedTitle: Fn<{ caregiver: string }>;
    receivedBody: string;
    sentTitle: Fn<{ caregiver: string }>;
    sentBody: string;
    sendError: Fn<{ caregiver: string }>;
  };
  pay: {
    venmo: string;
    paypal: string;
    noHandles: Fn<{ caregiver: string }>;
    zelleTitle: string;
    zelleSteps: Fn<{ amount: string; caregiver: string; handle: string }>;
    copyZelle: Fn<{ caregiver: string }>;
    afterSend: Fn<{ caregiver: string }>;
    sent: string;
    footnote: Fn<{ caregiver: string }>;
    note: Fn<{ parent: string; month: string }>;
  };
  totals: {
    costs: string;
    caregiverPaid: Fn<{ caregiver: string; amount: string }>;
    time: string;
    timeWorth: Fn<{ amount: string }>;
  };
  breakdown: {
    whoTitle: string;
    whoBody: Fn<{ rate: string }>;
    colName: string;
    colPaid: string;
    colTime: string;
    colSuggestedShort: string;
    colSuggested: string;
    caregiverRole: string;
    moneyTitle: string;
    paidBy: Fn<{ name: string }>;
    family: string;
    timeTitle: string;
    timeTotal: Fn<{ duration: string }>;
    perHour: string;
  };
  invalid: { title: string; body: string; cta: string };
  loading: string;
  categories: Record<string, string>;
}

const en: SiblingCopy = {
  meta: {
    title: ({ month, caregiver }) => `${month} care update from ${caregiver} · Kinvoice`,
    fallbackTitle: "Kinvoice",
  },
  header: {
    from: ({ caregiver, month }) => `From ${caregiver} · ${month}`,
    title: ({ parent }) => `Care update for ${parent}`,
    language: "Language",
  },
  settle: {
    title: "Your part this month",
    pick: "Tap your name to see your suggested contribution.",
    notYou: "Not you? Tap your name.",
    whoIsReading: "Who is reading",
    yourSuggested: ({ name }) => `${name}, your suggested contribution`,
    coveredTitle: "You’ve already covered your share this month.",
    coveredBody: ({ name }) => `Thank you, ${name}.`,
    receivedTitle: ({ caregiver }) => `${caregiver} confirmed it arrived.`,
    receivedBody: "Thank you for chipping in.",
    sentTitle: ({ caregiver }) => `You marked it as sent. ${caregiver} will confirm when it arrives.`,
    sentBody: "Nothing else to do. Thank you.",
    sendError: ({ caregiver }) => `That didn’t go through. Please try again, or just let ${caregiver} know.`,
  },
  pay: {
    venmo: "Pay with Venmo",
    paypal: "Pay with PayPal",
    noHandles: ({ caregiver }) => `Send it to ${caregiver} however you usually do.`,
    zelleTitle: "Prefer Zelle?",
    zelleSteps: ({ amount, caregiver, handle }) =>
      `Open your bank app → Zelle → send ${amount} to ${caregiver} at ${handle}.`,
    copyZelle: ({ caregiver }) => `Copy ${caregiver}’s Zelle`,
    afterSend: ({ caregiver }) => `Once you’ve sent it, let ${caregiver} know with one tap.`,
    sent: "I’ve sent it",
    footnote: ({ caregiver }) =>
      `Kinvoice never handles money. Payments go straight to ${caregiver} through the app you choose.`,
    note: ({ parent, month }) => `${parent}'s care, ${month}`,
  },
  totals: {
    costs: "Care costs this month",
    caregiverPaid: ({ caregiver, amount }) => `${caregiver} paid ${amount} of it.`,
    time: "Care time given",
    timeWorth: ({ amount }) => `Worth ${amount}, shown for recognition, not split.`,
  },
  breakdown: {
    whoTitle: "Who gave what",
    whoBody: ({ rate }) =>
      `Costs are shared equally. Time is shown for recognition and valued at ${rate}/hr, but it is never added to anyone’s contribution.`,
    colName: "Name",
    colPaid: "Paid",
    colTime: "Time",
    colSuggestedShort: "Suggested",
    colSuggested: "Suggested contribution",
    caregiverRole: "Caregiver",
    moneyTitle: "Where the money went",
    paidBy: ({ name }) => `paid by ${name}`,
    family: "family",
    timeTitle: "Time given",
    timeTotal: ({ duration }) => `${duration} of care this month.`,
    perHour: "/hr",
  },
  invalid: {
    title: "This invoice link isn’t working",
    body: "It may have been mistyped, or the family workspace was deleted. Ask whoever sent it for a fresh link.",
    cta: "What is Kinvoice?",
  },
  loading: "Opening the care update",
  categories: {
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
  },
};

const ru: SiblingCopy = {
  meta: {
    title: ({ month, caregiver }) => `${month}: отчёт об уходе от ${caregiver} · Kinvoice`,
    fallbackTitle: "Kinvoice",
  },
  header: {
    from: ({ caregiver, month }) => `От ${caregiver} · ${month}`,
    title: ({ parent }) => `Уход за ${parent}: итоги месяца`,
    language: "Язык",
  },
  settle: {
    title: "Ваша часть в этом месяце",
    pick: "Нажмите на своё имя, чтобы увидеть предлагаемый вклад.",
    notYou: "Это не вы? Нажмите на своё имя.",
    whoIsReading: "Кто читает",
    yourSuggested: ({ name }) => `${name}, ваш предлагаемый вклад`,
    coveredTitle: "В этом месяце вы уже покрыли свою долю.",
    coveredBody: ({ name }) => `Спасибо, ${name}.`,
    receivedTitle: ({ caregiver }) => `${caregiver} подтверждает: перевод получен.`,
    receivedBody: "Спасибо за ваш вклад.",
    sentTitle: ({ caregiver }) => `Вы отметили перевод. ${caregiver} подтвердит, когда деньги придут.`,
    sentBody: "Больше ничего делать не нужно. Спасибо.",
    sendError: ({ caregiver }) => `Не получилось. Попробуйте ещё раз или просто напишите ${caregiver}.`,
  },
  pay: {
    venmo: "Оплатить через Venmo",
    paypal: "Оплатить через PayPal",
    noHandles: ({ caregiver }) => `Переведите ${caregiver} привычным способом.`,
    zelleTitle: "Удобнее Zelle?",
    zelleSteps: ({ amount, caregiver, handle }) =>
      `Откройте приложение банка → Zelle → отправьте ${amount} получателю ${caregiver} (${handle}).`,
    copyZelle: ({ caregiver }) => `Скопировать Zelle (${caregiver})`,
    afterSend: ({ caregiver }) => `Когда переведёте, сообщите ${caregiver} одним нажатием.`,
    sent: "Перевод отправлен",
    footnote: ({ caregiver }) =>
      `Kinvoice не касается денег. Платёж идёт напрямую ${caregiver} через выбранное вами приложение.`,
    note: ({ parent, month }) => `Уход за ${parent}, ${month}`,
  },
  totals: {
    costs: "Расходы на уход за месяц",
    caregiverPaid: ({ caregiver, amount }) => `Из них ${amount} оплачено: ${caregiver}.`,
    time: "Время ухода",
    timeWorth: ({ amount }) => `Оценено в ${amount}: для признания, в расчёт не входит.`,
  },
  breakdown: {
    whoTitle: "Кто что внёс",
    whoBody: ({ rate }) =>
      `Расходы делятся поровну. Время показано для признания и оценено в ${rate}/ч, но к вкладу никогда не добавляется.`,
    colName: "Имя",
    colPaid: "Оплачено",
    colTime: "Время",
    colSuggestedShort: "Вклад",
    colSuggested: "Предлагаемый вклад",
    caregiverRole: "Ухаживает",
    moneyTitle: "Куда ушли деньги",
    paidBy: ({ name }) => `платёж: ${name}`,
    family: "семья",
    timeTitle: "Время ухода",
    timeTotal: ({ duration }) => `${duration} ухода в этом месяце.`,
    perHour: "/ч",
  },
  invalid: {
    title: "Эта ссылка не работает",
    body: "Возможно, в ней опечатка или семейное пространство удалено. Попросите отправителя прислать новую ссылку.",
    cta: "Что такое Kinvoice?",
  },
  loading: "Открываем отчёт об уходе",
  categories: {
    medication: "Лекарства",
    medical: "Медицина",
    groceries: "Продукты",
    transport: "Транспорт",
    household: "Дом и быт",
    home_care: "Сиделка на дому",
    insurance: "Страховка",
    appointments: "Приёмы у врача",
    errands: "Поручения",
    personal_care: "Личный уход",
    companionship: "Общение",
    admin: "Документы и счета",
    other: "Другое",
  },
};

const kk: SiblingCopy = {
  meta: {
    title: ({ month, caregiver }) => `${month}: ${caregiver} жіберген күтім есебі · Kinvoice`,
    fallbackTitle: "Kinvoice",
  },
  header: {
    from: ({ caregiver, month }) => `Жіберуші: ${caregiver} · ${month}`,
    title: ({ parent }) => `${parent}: айдың күтім есебі`,
    language: "Тіл",
  },
  settle: {
    title: "Осы айдағы сіздің үлесіңіз",
    pick: "Ұсынылған үлесіңізді көру үшін атыңызды басыңыз.",
    notYou: "Бұл сіз емессіз бе? Атыңызды басыңыз.",
    whoIsReading: "Кім оқып отыр",
    yourSuggested: ({ name }) => `${name}, сіздің ұсынылған үлесіңіз`,
    coveredTitle: "Осы айда өз үлесіңізді толық өтедіңіз.",
    coveredBody: ({ name }) => `Рақмет, ${name}.`,
    receivedTitle: ({ caregiver }) => `${caregiver} аударманың келгенін растады.`,
    receivedBody: "Үлесіңіз үшін рақмет.",
    sentTitle: ({ caregiver }) => `Аударғаныңызды белгіледіңіз. Ақша келгенде ${caregiver} растайды.`,
    sentBody: "Басқа ештеңе істеудің қажеті жоқ. Рақмет.",
    sendError: () => "Жіберілмеді. Қайта көріңіз немесе тікелей хабарласыңыз.",
  },
  pay: {
    venmo: "Venmo арқылы төлеу",
    paypal: "PayPal арқылы төлеу",
    noHandles: () => "Әдеттегі тәсілмен аударыңыз.",
    zelleTitle: "Zelle ыңғайлы ма?",
    zelleSteps: ({ amount, caregiver, handle }) =>
      `Банк қосымшасын ашыңыз → Zelle → ${amount} соманы алушыға жіберіңіз: ${caregiver} (${handle}).`,
    copyZelle: ({ caregiver }) => `Zelle көшіру (${caregiver})`,
    afterSend: () => "Аударған соң бір басумен хабарлаңыз.",
    sent: "Жібердім",
    footnote: () => "Kinvoice ақшаны ұстамайды. Төлем сіз таңдаған қосымша арқылы тікелей алушыға жетеді.",
    note: ({ parent, month }) => `${parent} күтімі, ${month}`,
  },
  totals: {
    costs: "Айлық күтім шығыны",
    caregiverPaid: ({ caregiver, amount }) => `Оның ${amount} сомасын ${caregiver} төледі.`,
    time: "Күтімге берілген уақыт",
    timeWorth: ({ amount }) => `${amount} деп бағаланды: құрмет үшін, бөлінбейді.`,
  },
  breakdown: {
    whoTitle: "Кім не қосты",
    whoBody: ({ rate }) =>
      `Шығын тең бөлінеді. Уақыт құрмет үшін көрсетіледі және сағатына ${rate} деп бағаланады, бірақ ешкімнің үлесіне қосылмайды.`,
    colName: "Есімі",
    colPaid: "Төледі",
    colTime: "Уақыт",
    colSuggestedShort: "Үлес",
    colSuggested: "Ұсынылған үлес",
    caregiverRole: "Күтуші",
    moneyTitle: "Ақша неге жұмсалды",
    paidBy: ({ name }) => `төлеген: ${name}`,
    family: "отбасы",
    timeTitle: "Берілген уақыт",
    timeTotal: ({ duration }) => `Осы айда ${duration} күтім.`,
    perHour: "/сағ",
  },
  invalid: {
    title: "Бұл сілтеме жұмыс істемейді",
    body: "Мүмкін, қате терілген немесе отбасы кеңістігі өшірілген. Жіберген адамнан жаңа сілтеме сұраңыз.",
    cta: "Kinvoice деген не?",
  },
  loading: "Күтім есебі ашылуда",
  categories: {
    medication: "Дәрі-дәрмек",
    medical: "Медицина",
    groceries: "Азық-түлік",
    transport: "Көлік",
    household: "Үй шаруасы",
    home_care: "Үйдегі күтуші",
    insurance: "Сақтандыру",
    appointments: "Дәрігер қабылдауы",
    errands: "Тапсырмалар",
    personal_care: "Жеке күтім",
    companionship: "Бірге өткізілген уақыт",
    admin: "Құжаттар мен шоттар",
    other: "Басқа",
  },
};

const COPY: Record<Locale, SiblingCopy> = { en, ru, kk };

export function siblingCopy(locale: Locale): SiblingCopy {
  return COPY[locale];
}

export function categoryName(copy: SiblingCopy, category: string): string {
  return copy.categories[category] ?? copy.categories.other;
}
