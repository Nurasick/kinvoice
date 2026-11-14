/**
 * Invoice composer and sent-invoices copy in English, Russian and Kazakh. Owner: Yernur.
 * Rules: "suggested contribution", never "owe". Amounts and durations arrive formatted.
 * Russian avoids gendered past-tense verbs about family members.
 */
import type { Locale } from "@/lib/i18n/locales";
import type { InvoiceTone } from "@/shared/domain";
import type { SiblingStatus } from "./invoice-view";

type Fn<P> = (p: P) => string;

export type ComposerError = "draft" | "empty" | "publish";

export interface InvoiceCopy {
  screen: {
    title: string;
    subtitle: string;
    loading: Fn<{ month: string }>;
    errorTitle: string;
    errorBody: string;
    tryAgain: string;
    noCostsTitle: Fn<{ month: string }>;
    noCostsBody: string;
    logCare: string;
    sentTitle: string;
    loadingInvoices: string;
    invoicesError: string;
  };
  composer: {
    alreadySent: Fn<{ date: string }>;
    tone: string;
    tones: Record<InvoiceTone, { label: string; hint: string }>;
    messageLabel: string;
    templateHint: string;
    draftHint: string;
    placeholder: string;
    drafting: string;
    publish: string;
    redraft: string;
    errors: Record<ComposerError, string>;
  };
  preview: {
    costs: string;
    caregiverLine: Fn<{ name: string; paid: string; time: string }>;
    suggested: string;
    frozen: string;
  };
  published: {
    title: Fn<{ month: string }>;
    body: string;
    suggested: string;
    sendTo: Fn<{ name: string }>;
    text: string;
    copy: string;
    copyFamily: string;
    preview: string;
    another: string;
  };
  list: {
    emptyTitle: string;
    emptyBody: string;
    meta: Fn<{ date: string; total: string; settled: number; count: number }>;
    open: string;
    copyLink: string;
    copied: string;
    status: Record<SiblingStatus, string>;
    copyPersonal: Fn<{ name: string }>;
    markReceived: string;
    failed: string;
  };
}

const en: InvoiceCopy = {
  screen: {
    title: "Care invoice",
    subtitle: "One calm update your siblings can open without an account.",
    loading: ({ month }) => `Loading ${month}`,
    errorTitle: "We couldn't load this month",
    errorBody: "Your data is safe. This is usually a brief connection hiccup.",
    tryAgain: "Try again",
    noCostsTitle: ({ month }) => `No care costs logged for ${month}`,
    noCostsBody: "An invoice shares out-of-pocket costs, so log at least one expense first.",
    logCare: "Log care",
    sentTitle: "Sent invoices",
    loadingInvoices: "Loading invoices",
    invoicesError: "We couldn't load your invoices",
  },
  composer: {
    alreadySent: ({ date }) =>
      `You already sent an invoice for this month on ${date}. Publishing again creates a new link; the old one keeps working.`,
    tone: "Tone",
    tones: {
      warm: { label: "Warm", hint: "Personal and appreciative" },
      brief: { label: "Brief", hint: "A few friendly lines" },
      direct: { label: "Direct", hint: "Numbers first, clear ask" },
    },
    messageLabel: "Message to your siblings",
    templateHint: "This is our standard wording. Make it your own, or try another tone.",
    draftHint: "Drafted from this month’s real numbers. Edit anything before you publish.",
    placeholder: "A short update for your siblings…",
    drafting: "Writing a draft…",
    publish: "Publish and get link",
    redraft: "Redraft",
    errors: {
      draft: "We couldn't write a draft just now. You can type your own message.",
      empty: "Add a short message before publishing.",
      publish: "We couldn't publish just now. Your message is still here, so please try again.",
    },
  },
  preview: {
    costs: "Care costs this month",
    caregiverLine: ({ name, paid, time }) => `${name} paid ${paid} and gave ${time}.`,
    suggested: "suggested contribution",
    frozen: "These numbers are frozen when you publish, so later edits never change a link you already sent.",
  },
  published: {
    title: ({ month }) => `Your ${month} invoice is ready to send`,
    body: "Each sibling gets their own link that opens on their part. They don’t need an account or an app.",
    suggested: "Suggested contribution",
    sendTo: ({ name }) => `Send ${name} their link`,
    text: "Text",
    copy: "Copy",
    copyFamily: "Copy family link",
    preview: "Preview as a sibling",
    another: "Write another",
  },
  list: {
    emptyTitle: "No invoices sent yet",
    emptyBody: "When you publish one, it shows up here so you can see who has chipped in.",
    meta: ({ date, total, settled, count }) =>
      `Published ${date} · ${total} in care costs · ${settled} of ${count} settled`,
    open: "Open",
    copyLink: "Copy link",
    copied: "Copied",
    status: {
      waiting: "Not yet",
      sent: "Says it’s sent",
      received: "Received",
      covered: "Covered their share",
    },
    copyPersonal: ({ name }) => `Copy ${name}’s link`,
    markReceived: "Mark as received",
    failed: "Didn’t save. Try again.",
  },
};

const ru: InvoiceCopy = {
  screen: {
    title: "Счёт за уход",
    subtitle: "Одно спокойное сообщение, которое братья и сёстры откроют без аккаунта.",
    loading: ({ month }) => `Загружаем ${month}`,
    errorTitle: "Не удалось загрузить этот месяц",
    errorBody: "Ваши данные в сохранности. Обычно это кратковременный сбой связи.",
    tryAgain: "Попробовать ещё раз",
    noCostsTitle: ({ month }) => `${month}: расходов на уход нет`,
    noCostsBody: "Счёт делит расходы из своего кармана, поэтому сначала запишите хотя бы один расход.",
    logCare: "Записать уход",
    sentTitle: "Отправленные счета",
    loadingInvoices: "Загружаем счета",
    invoicesError: "Не удалось загрузить ваши счета",
  },
  composer: {
    alreadySent: ({ date }) =>
      `Счёт за этот месяц уже отправлен (${date}). Новая публикация создаст новую ссылку, старая продолжит работать.`,
    tone: "Тон",
    tones: {
      warm: { label: "Тёплый", hint: "Лично и с благодарностью" },
      brief: { label: "Краткий", hint: "Пара дружеских строк" },
      direct: { label: "Прямой", hint: "Сначала цифры, ясная просьба" },
    },
    messageLabel: "Сообщение братьям и сёстрам",
    templateHint: "Это наш стандартный текст. Сделайте его своим или попробуйте другой тон.",
    draftHint: "Черновик по реальным цифрам этого месяца. Перед публикацией можно править что угодно.",
    placeholder: "Короткая новость для братьев и сестёр…",
    drafting: "Пишем черновик…",
    publish: "Опубликовать и получить ссылку",
    redraft: "Переписать",
    errors: {
      draft: "Сейчас не получилось написать черновик. Можно написать сообщение самим.",
      empty: "Перед публикацией добавьте короткое сообщение.",
      publish: "Сейчас не получилось опубликовать. Ваше сообщение на месте, попробуйте ещё раз.",
    },
  },
  preview: {
    costs: "Расходы на уход за месяц",
    caregiverLine: ({ name, paid, time }) => `${name}: оплачено ${paid}, время ухода ${time}.`,
    suggested: "предлагаемый вклад",
    frozen: "При публикации цифры фиксируются, поэтому поздние правки не изменят уже отправленную ссылку.",
  },
  published: {
    title: ({ month }) => `Счёт за ${month} готов к отправке`,
    body: "У каждого своя ссылка, которая открывается на его части. Аккаунт и приложение не нужны.",
    suggested: "Предлагаемый вклад",
    sendTo: ({ name }) => `Отправить ссылку: ${name}`,
    text: "SMS",
    copy: "Копировать",
    copyFamily: "Скопировать общую ссылку",
    preview: "Посмотреть глазами родственника",
    another: "Написать ещё один",
  },
  list: {
    emptyTitle: "Отправленных счетов пока нет",
    emptyBody: "После публикации счёт появится здесь, и вы увидите, кто уже внёс свою часть.",
    meta: ({ date, total, settled, count }) =>
      `Опубликован ${date} · расходы ${total} · рассчитались ${settled} из ${count}`,
    open: "Открыть",
    copyLink: "Скопировать ссылку",
    copied: "Скопировано",
    status: {
      waiting: "Ещё нет",
      sent: "Отмечен перевод",
      received: "Получено",
      covered: "Доля покрыта",
    },
    copyPersonal: ({ name }) => `Ссылка для ${name}`,
    markReceived: "Отметить как полученное",
    failed: "Не сохранилось. Попробуйте ещё раз.",
  },
};

const kk: InvoiceCopy = {
  screen: {
    title: "Күтім шоты",
    subtitle: "Бауырларыңыз аккаунтсыз ашатын бір сабырлы хабар.",
    loading: ({ month }) => `${month} жүктелуде`,
    errorTitle: "Бұл айды жүктеу мүмкін болмады",
    errorBody: "Деректеріңіз сақтаулы. Әдетте бұл байланыстың қысқа үзілісі.",
    tryAgain: "Қайта көру",
    noCostsTitle: ({ month }) => `${month}: күтім шығыны жазылмаған`,
    noCostsBody: "Шот өз қалтаңыздан кеткен шығынды бөледі, сондықтан алдымен кемінде бір шығын жазыңыз.",
    logCare: "Күтімді жазу",
    sentTitle: "Жіберілген шоттар",
    loadingInvoices: "Шоттар жүктелуде",
    invoicesError: "Шоттарыңызды жүктеу мүмкін болмады",
  },
  composer: {
    alreadySent: ({ date }) =>
      `Бұл айдың шоты ${date} жіберілген. Қайта жариялау жаңа сілтеме жасайды, ескісі жұмыс істей береді.`,
    tone: "Үн",
    tones: {
      warm: { label: "Жылы", hint: "Жеке әрі алғыспен" },
      brief: { label: "Қысқа", hint: "Бірнеше достық жол" },
      direct: { label: "Тура", hint: "Алдымен сандар, нақты өтініш" },
    },
    messageLabel: "Бауырларыңызға хабар",
    templateHint: "Бұл біздің стандартты мәтін. Өзіңізше өзгертіңіз немесе басқа үнді таңдаңыз.",
    draftHint:
      "Осы айдың нақты сандарымен жазылған жоба. Жарияламас бұрын кез келген жерін өзгертуге болады.",
    placeholder: "Бауырларыңызға қысқа хабар…",
    drafting: "Жоба жазылуда…",
    publish: "Жариялап, сілтеме алу",
    redraft: "Қайта жазу",
    errors: {
      draft: "Қазір жоба жазу мүмкін болмады. Хабарды өзіңіз жаза аласыз.",
      empty: "Жарияламас бұрын қысқа хабар қосыңыз.",
      publish: "Қазір жариялау мүмкін болмады. Хабарыңыз сақталған, қайта көріңіз.",
    },
  },
  preview: {
    costs: "Айлық күтім шығыны",
    caregiverLine: ({ name, paid, time }) => `${name}: ${paid} төледі, ${time} уақыт берді.`,
    suggested: "ұсынылған үлес",
    frozen: "Жариялағанда сандар бекітіледі, сондықтан кейінгі өзгерістер жіберілген сілтемені өзгертпейді.",
  },
  published: {
    title: ({ month }) => `${month} шоты жіберуге дайын`,
    body: "Әр бауырдың өз бөлігінде ашылатын жеке сілтемесі бар. Аккаунт пен қосымша қажет емес.",
    suggested: "Ұсынылған үлес",
    sendTo: ({ name }) => `Сілтемені жіберу: ${name}`,
    text: "SMS",
    copy: "Көшіру",
    copyFamily: "Ортақ сілтемені көшіру",
    preview: "Бауыр ретінде қарау",
    another: "Тағы біреуін жазу",
  },
  list: {
    emptyTitle: "Әлі жіберілген шот жоқ",
    emptyBody: "Шотты жариялағанда ол осында шығады, кім үлесін қосқанын көресіз.",
    meta: ({ date, total, settled, count }) =>
      `Жарияланды: ${date} · шығын ${total} · есеп айырысқандар: ${settled}/${count}`,
    open: "Ашу",
    copyLink: "Сілтемені көшіру",
    copied: "Көшірілді",
    status: {
      waiting: "Әлі жоқ",
      sent: "Аударым белгіленді",
      received: "Алынды",
      covered: "Үлесі өтелген",
    },
    copyPersonal: ({ name }) => `Сілтеме: ${name}`,
    markReceived: "Алынды деп белгілеу",
    failed: "Сақталмады. Қайта көріңіз.",
  },
};

const COPY: Record<Locale, InvoiceCopy> = { en, ru, kk };

export function invoiceCopy(locale: Locale): InvoiceCopy {
  return COPY[locale];
}
