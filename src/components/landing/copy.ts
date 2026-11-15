/**
 * Landing page copy in English, Russian and Kazakh. Owner: Nurali.
 * Rules: say "suggested contribution", never "owe"; amounts are passed in already formatted (USD).
 */
import type { Locale } from "@/lib/i18n/locales";

export interface LandingCopy {
  meta: { title: string; description: string };
  nav: { tryDemo: string; language: string; home: string };
  hero: {
    title: string;
    sub: string;
    cta: string;
    ctaLoading: string;
    ctaError: string;
    secondary: string;
    note: string;
    /** One line telling a juror which screens to open, in order (two roles: caregiver, sibling). */
    judges: string;
    price: string;
  };
  fridge: {
    sceneLabel: (p: { caregiver: string; sibling: string; amount: string }) => string;
    receiptItem: string;
    receiptTotal: string;
    cardTitle: string;
    cardWho: string;
    cardWhen: string;
    sticky: (p: { sibling: string; amount: string }) => string;
    labelMedication: string;
    labelAppointment: string;
    labelSiblingPaid: (p: { sibling: string }) => string;
    labelInvoice: (p: { sibling: string }) => string;
    /** Handwritten caption on the family snapshot. */
    photoCaption: string;
    invoiceTitle: (p: { month: string }) => string;
    invoiceGreeting: (p: { sibling: string }) => string;
    invoiceCosts: string;
    invoiceCaregiver: (p: { caregiver: string; paid: string; time: string }) => string;
    invoiceYouPaid: (p: { paid: string }) => string;
    invoiceShare: string;
    invoicePay: string;
    invoiceFoot: string;
  };
  problem: {
    title: string;
    body: string;
    paid: string;
    time: string;
    caregiver: string;
    sibling: string;
    nothing: string;
    statOne: string;
    statOneSource: string;
    statTwo: string;
    statTwoSource: string;
    chartLabel: string;
  };
  steps: {
    title: string;
    one: {
      title: string;
      body: string;
      sentence: string;
      chipExpense: string;
      chipTime: string;
      confirm: string;
    };
    two: {
      title: string;
      body: string;
      amount: string;
      store: string;
      date: string;
      category: string;
      categoryValue: string;
    };
    three: { title: string; body: string; phoneTitle: string; sent: string };
    honest: string;
  };
  pricing: {
    title: string;
    plan: string;
    perMonth: string;
    firstMonth: string;
    features: string[];
    cta: string;
    note: string;
    siblingsTitle: string;
    siblingsBody: string;
  };
  trust: { title: string; points: { title: string; body: string }[] };
  close: {
    title: string;
    cta: string;
    /** Mike's handwritten note after he pays (demo story; amount from the seed). */
    note: (p: { caregiver: string; amount: string }) => string;
  };
  footer: { line: string };
}

const en: LandingCopy = {
  meta: {
    title: "Kinvoice: a fair monthly care invoice for your siblings",
    description:
      "You carry Mom's care. Kinvoice turns the receipts, drives and hours into one monthly invoice your siblings open from a link and pay in one tap.",
  },
  nav: { tryDemo: "Try the demo", language: "Language", home: "Kinvoice home" },
  hero: {
    title: "You carry Mom’s care. Now your siblings can see it.",
    sub: "Kinvoice turns the receipts, drives and hours on your fridge into one fair monthly invoice. Your siblings open a link, with no app and no account, and send their share in one tap.",
    cta: "Try Sarah’s family",
    ctaLoading: "Opening Sarah’s family…",
    ctaError: "We couldn’t open the demo just now. Please try again in a moment.",
    secondary: "Start your own",
    note: "No sign-up. Opens a private copy of a real month.",
    judges: "For judges: Try Sarah’s family → Log one sentence → Invoice → Publish → Preview as a sibling → I’ve sent it → back on Invoice, Mark as received.",
    price: "Free for your siblings. $5.99 a month for you, first month free.",
  },
  fridge: {
    sceneLabel: ({ caregiver, sibling, amount }) =>
      `${caregiver}'s fridge: a pharmacy receipt, a cardiology appointment card and a note about ${sibling}'s purchase, all turned into one invoice. ${sibling}'s suggested contribution is ${amount}.`,
    receiptItem: "Monthly prescriptions",
    receiptTotal: "Total",
    cardTitle: "Cardiology",
    cardWho: "Patient: Linda",
    cardWhen: "Tue · 10:30 AM",
    sticky: ({ sibling, amount }) => `${sibling} got the shower grab bars, ${amount}. Paid!`,
    labelMedication: "Medication",
    labelAppointment: "Appointments",
    labelSiblingPaid: ({ sibling }) => `${sibling} paid`,
    labelInvoice: ({ sibling }) => `What ${sibling} opens. No account.`,
    photoCaption: "Mom’s 71st, all of us",
    invoiceTitle: ({ month }) => `${month} care invoice`,
    invoiceGreeting: ({ sibling }) => `Hi ${sibling}, here is Mom’s month.`,
    invoiceCosts: "Care costs this month",
    invoiceCaregiver: ({ caregiver, paid, time }) => `${caregiver} paid ${paid} and gave ${time}`,
    invoiceYouPaid: ({ paid }) => `You already paid ${paid}`,
    invoiceShare: "Your suggested contribution",
    invoicePay: "Pay with Venmo",
    invoiceFoot: "PayPal and Zelle work too",
  },
  problem: {
    title: "One sibling does almost everything. Nobody else sees it.",
    body: "This is Sarah’s month in the demo. The money and the hours sit with one person, and the bill for it never gets sent.",
    paid: "Paid",
    time: "Time given",
    caregiver: "Lives 10 minutes from Mom",
    sibling: "Lives in another state",
    nothing: "nothing",
    statOne: "Only 1 in 10 families share parent care equally.",
    statOneSource: "Northwestern Mutual",
    statTwo: "Money is the number one reason siblings fight over a parent’s care.",
    statTwoSource: "Bay Alarm Medical survey",
    chartLabel: "Money paid and time given this month, per sibling",
  },
  steps: {
    title: "From the fridge to a fair share, in three steps",
    one: {
      title: "Say it in one sentence",
      body: "Type what happened, the way you’d text it. Kinvoice drafts the entries and you confirm them.",
      sentence: "Paid $86 at CVS for Mom’s meds, then drove her to the cardiologist, 3 hours.",
      chipExpense: "Medication",
      chipTime: "Appointments",
      confirm: "Confirm both",
    },
    two: {
      title: "Snap the receipt",
      body: "A photo or a PDF. The amount, store, date and category are filled in for you to check.",
      amount: "Amount",
      store: "Store",
      date: "Date",
      category: "Category",
      categoryValue: "Medication",
    },
    three: {
      title: "Send one link",
      body: "Your siblings see the month and their suggested contribution, then pay with Venmo, PayPal or Zelle. No app, no account.",
      phoneTitle: "Mom’s care, this month",
      sent: "I’ve sent it",
    },
    honest:
      "The AI only drafts. Every total and split is plain arithmetic you can check, and nothing is sent until you press the button.",
  },
  pricing: {
    title: "One simple price. Your siblings never pay for Kinvoice.",
    plan: "Kinvoice for caregivers",
    perMonth: "a month",
    firstMonth: "First month free",
    features: [
      "Unlimited entries, receipts and AI drafts",
      "A monthly invoice link for every sibling",
      "Venmo, PayPal and Zelle buttons with the amount filled in",
      "Your month at a glance: money and time, side by side",
    ],
    cta: "Start your free month",
    note: "Try the demo first. No card, no sign-up.",
    siblingsTitle: "For siblings: free",
    siblingsBody: "They only open the link. No download, no account, no password.",
  },
  trust: {
    title: "Calm about money. Careful with Mom’s data.",
    points: [
      { title: "No medical records", body: "Only amounts, categories and short notes." },
      { title: "No accounts or passwords", body: "Private links that nobody can guess." },
      { title: "Delete everything", body: "One click removes the family and every link." },
    ],
  },
  close: {
    title: "See Sarah’s month in ten seconds.",
    cta: "Try Sarah’s family",
    note: ({ caregiver, amount }) => `Sent my ${amount} for Mom. Thank you for doing all this, ${caregiver}!`,
  },
  footer: { line: "Kinvoice. Built for Business Cup 2.0, Nazarbayev University." },
};

const ru: LandingCopy = {
  meta: {
    title: "Kinvoice: честный ежемесячный счёт за уход для братьев и сестёр",
    description:
      "Заботу о маме несёте вы. Kinvoice превращает чеки, поездки и часы в один ежемесячный счёт: братья и сёстры открывают ссылку и переводят свою долю в одно касание.",
  },
  nav: { tryDemo: "Открыть демо", language: "Язык", home: "Kinvoice, главная" },
  hero: {
    title: "Заботу о маме несёте вы. Теперь братья и сёстры это увидят.",
    sub: "Kinvoice превращает чеки, поездки и часы ухода с вашего холодильника в один честный счёт за месяц. Братья и сёстры открывают ссылку — без приложения и регистрации — и переводят свою долю в одно касание.",
    cta: "Посмотреть на семье Сары",
    ctaLoading: "Открываем семью Сары…",
    ctaError: "Не получилось открыть демо. Попробуйте ещё раз через минуту.",
    secondary: "Создать свою семью",
    note: "Без регистрации. Откроется ваша личная копия реального месяца.",
    judges: "Для жюри: «Посмотреть на семье Сары» → «Учёт»: одна фраза → «Счёт» → опубликовать → «Посмотреть глазами родственника» → «Перевод отправлен» → в «Счёте» отметить как полученное.",
    price: "Для братьев и сестёр бесплатно. Для вас $5.99 в месяц, первый месяц бесплатно.",
  },
  fridge: {
    sceneLabel: ({ caregiver, sibling, amount }) =>
      `Холодильник ${caregiver}: чек из аптеки, талон к кардиологу и записка о покупке ${sibling} — всё собрано в один счёт. Предлагаемый вклад ${sibling}: ${amount}.`,
    receiptItem: "Лекарства на месяц",
    receiptTotal: "Итого",
    cardTitle: "Кардиология",
    cardWho: "Пациент: Линда",
    cardWhen: "Вт · 10:30",
    sticky: ({ sibling, amount }) => `${sibling} купил поручни в душ, ${amount}. Оплачено!`,
    labelMedication: "Лекарства",
    labelAppointment: "Визиты к врачу",
    labelSiblingPaid: ({ sibling }) => `Оплатил ${sibling}`,
    labelInvoice: ({ sibling }) => `Это видит ${sibling}. Без аккаунта.`,
    photoCaption: "Мамины 71, все вместе",
    invoiceTitle: ({ month }) => `Счёт за уход: ${month}`,
    invoiceGreeting: ({ sibling }) => `Привет, ${sibling}! Вот мамин месяц.`,
    invoiceCosts: "Расходы на уход за месяц",
    invoiceCaregiver: ({ caregiver, paid, time }) => `${caregiver} оплатила ${paid} и уделила ${time}`,
    invoiceYouPaid: ({ paid }) => `Вы уже оплатили ${paid}`,
    invoiceShare: "Ваш предлагаемый вклад",
    invoicePay: "Оплатить через Venmo",
    invoiceFoot: "Можно и через PayPal или Zelle",
  },
  problem: {
    title: "Почти всё делает один из детей. Остальные этого не видят.",
    body: "Это месяц Сары из демо. Деньги и часы лежат на одном человеке, а счёт за это так никто и не выставил.",
    paid: "Оплачено",
    time: "Время",
    caregiver: "Живёт в 10 минутах от мамы",
    sibling: "Живёт в другом штате",
    nothing: "ничего",
    statOne: "Только в 1 из 10 семей уход за родителями делят поровну.",
    statOneSource: "Northwestern Mutual",
    statTwo: "Деньги — главная причина ссор между братьями и сёстрами из-за ухода за родителем.",
    statTwoSource: "Опрос Bay Alarm Medical",
    chartLabel: "Деньги и время за этот месяц по каждому из детей",
  },
  steps: {
    title: "От холодильника к честной доле — за три шага",
    one: {
      title: "Скажите одним предложением",
      body: "Напишите, что произошло, как в сообщении. Kinvoice подготовит записи, а вы их подтвердите.",
      sentence: "Заплатила $86 в CVS за мамины лекарства, потом отвезла её к кардиологу, 3 часа.",
      chipExpense: "Лекарства",
      chipTime: "Визиты к врачу",
      confirm: "Подтвердить обе",
    },
    two: {
      title: "Сфотографируйте чек",
      body: "Фото или PDF. Сумма, магазин, дата и категория заполнятся сами — вам останется проверить.",
      amount: "Сумма",
      store: "Магазин",
      date: "Дата",
      category: "Категория",
      categoryValue: "Лекарства",
    },
    three: {
      title: "Отправьте одну ссылку",
      body: "Братья и сёстры видят месяц и свой предлагаемый вклад и платят через Venmo, PayPal или Zelle. Без приложения и аккаунта.",
      phoneTitle: "Уход за мамой в этом месяце",
      sent: "Я отправил",
    },
    honest:
      "ИИ только готовит черновики. Все суммы и доли — обычная арифметика, которую можно проверить, и ничего не уходит, пока вы не нажмёте кнопку.",
  },
  pricing: {
    title: "Одна простая цена. Братья и сёстры за Kinvoice не платят.",
    plan: "Kinvoice для того, кто ухаживает",
    perMonth: "в месяц",
    firstMonth: "Первый месяц бесплатно",
    features: [
      "Без ограничений: записи, чеки и черновики от ИИ",
      "Ссылка на ежемесячный счёт для каждого брата и сестры",
      "Кнопки Venmo, PayPal и Zelle с готовой суммой",
      "Весь месяц на одном экране: деньги и время рядом",
    ],
    cta: "Начать бесплатный месяц",
    note: "Сначала попробуйте демо. Без карты и регистрации.",
    siblingsTitle: "Для братьев и сестёр — бесплатно",
    siblingsBody: "Они просто открывают ссылку. Ничего не скачивают, без аккаунта и пароля.",
  },
  trust: {
    title: "Спокойно о деньгах. Бережно к маминым данным.",
    points: [
      { title: "Никаких медкарт", body: "Только суммы, категории и короткие заметки." },
      { title: "Без аккаунтов и паролей", body: "Личные ссылки, которые невозможно угадать." },
      { title: "Удалить всё", body: "Один клик удаляет семью и все ссылки." },
    ],
  },
  close: {
    title: "Посмотрите месяц Сары за десять секунд.",
    cta: "Посмотреть на семье Сары",
    note: ({ caregiver, amount }) => `Перевёл ${amount} на маму. Спасибо, что всё это тянешь, ${caregiver}!`,
  },
  footer: { line: "Kinvoice. Сделано для Business Cup 2.0, Назарбаев Университет." },
};

const kk: LandingCopy = {
  meta: {
    title: "Kinvoice: бауырларға арналған әділ айлық күтім шоты",
    description:
      "Анаңыздың күтімін сіз көтеріп жүрсіз. Kinvoice чектерді, сапарларды және сағаттарды бір айлық шотқа айналдырады: бауырларыңыз сілтемені ашып, өз үлесін бір рет басып жібереді.",
  },
  nav: { tryDemo: "Демоны ашу", language: "Тіл", home: "Kinvoice, басты бет" },
  hero: {
    title: "Анаңыздың күтімін сіз көтеріп жүрсіз. Енді бауырларыңыз да көреді.",
    sub: "Kinvoice тоңазытқыштағы чектерді, сапарларды және күтім сағаттарын бір әділ айлық шотқа айналдырады. Бауырларыңыз сілтемені ашады — қосымшасыз, тіркелусіз — және өз үлесін бір рет басып жібереді.",
    cta: "Сараның отбасын көру",
    ctaLoading: "Сараның отбасы ашылып жатыр…",
    ctaError: "Демо қазір ашылмады. Бір минуттан соң қайта көріңіз.",
    secondary: "Өз отбасыңызды құру",
    note: "Тіркелусіз. Нақты айдың жеке көшірмесі ашылады.",
    judges: "Қазылар үшін: «Сараның отбасын көру» → «Жазбалар»: бір сөйлем → «Шот» → жариялау → «Бауыр ретінде қарау» → «Жібердім» → «Шот» бөлімінде алынды деп белгілеу.",
    price: "Бауырларыңызға тегін. Сізге айына $5.99, алғашқы ай тегін.",
  },
  fridge: {
    sceneLabel: ({ caregiver, sibling, amount }) =>
      `${caregiver} тоңазытқышы: дәріхана чегі, кардиологқа жазылу талоны және ${sibling} сатып алғаны туралы жазба — бәрі бір шотқа жиналды. ${sibling} үшін ұсынылған үлес: ${amount}.`,
    receiptItem: "Айлық дәрі-дәрмек",
    receiptTotal: "Барлығы",
    cardTitle: "Кардиология",
    cardWho: "Науқас: Линда",
    cardWhen: "Сс · 10:30",
    sticky: ({ sibling, amount }) => `${sibling} душқа тұтқа алды, ${amount}. Төленді!`,
    labelMedication: "Дәрі-дәрмек",
    labelAppointment: "Дәрігерге бару",
    labelSiblingPaid: ({ sibling }) => `${sibling} төледі`,
    labelInvoice: ({ sibling }) => `${sibling} көретіні. Аккаунтсыз.`,
    photoCaption: "Анамыздың 71 жасы, бәріміз бірге",
    invoiceTitle: ({ month }) => `Күтім шоты: ${month}`,
    invoiceGreeting: ({ sibling }) => `Сәлем, ${sibling}! Анамыздың айы осындай.`,
    invoiceCosts: "Айдағы күтім шығыны",
    invoiceCaregiver: ({ caregiver, paid, time }) => `${caregiver} ${paid} төледі және ${time} уақыт бөлді`,
    invoiceYouPaid: ({ paid }) => `Сіз ${paid} төлеп қойдыңыз`,
    invoiceShare: "Сізге ұсынылған үлес",
    invoicePay: "Venmo арқылы төлеу",
    invoiceFoot: "PayPal немесе Zelle де болады",
  },
  problem: {
    title: "Бәрін дерлік бір бала атқарады. Басқалары мұны көрмейді.",
    body: "Бұл — демодағы Сараның айы. Ақша да, уақыт та бір адамның мойнында, ал оның шотын ешкім жібермеген.",
    paid: "Төледі",
    time: "Уақыт",
    caregiver: "Анасынан 10 минуттық жерде тұрады",
    sibling: "Басқа штатта тұрады",
    nothing: "жоқ",
    statOne: "Ата-ана күтімін тең бөлісетін отбасы — онның біреуі ғана.",
    statOneSource: "Northwestern Mutual",
    statTwo: "Ата-ана күтімі үшін бауырлар арасындағы ұрыстың басты себебі — ақша.",
    statTwoSource: "Bay Alarm Medical сауалнамасы",
    chartLabel: "Осы айда әр баланың төлеген ақшасы мен бөлген уақыты",
  },
  steps: {
    title: "Тоңазытқыштан әділ үлеске дейін — үш қадам",
    one: {
      title: "Бір сөйлеммен айтыңыз",
      body: "Не болғанын хабарлама жазғандай жазыңыз. Kinvoice жазбаларды дайындайды, сіз растайсыз.",
      sentence: "CVS-те анамның дәрісіне $86 төледім, кейін оны кардиологқа апардым, 3 сағат.",
      chipExpense: "Дәрі-дәрмек",
      chipTime: "Дәрігерге бару",
      confirm: "Екеуін де растау",
    },
    two: {
      title: "Чекті суретке түсіріңіз",
      body: "Фото немесе PDF. Сома, дүкен, күн және санат өзі толтырылады — сізге тек тексеру қалады.",
      amount: "Сома",
      store: "Дүкен",
      date: "Күні",
      category: "Санат",
      categoryValue: "Дәрі-дәрмек",
    },
    three: {
      title: "Бір сілтеме жіберіңіз",
      body: "Бауырларыңыз айды және өзіне ұсынылған үлесті көріп, Venmo, PayPal немесе Zelle арқылы төлейді. Қосымшасыз, аккаунтсыз.",
      phoneTitle: "Осы айдағы ана күтімі",
      sent: "Жібердім",
    },
    honest:
      "ЖИ тек жобасын дайындайды. Барлық сома мен үлес — өзіңіз тексере алатын қарапайым арифметика, ал сіз батырманы баспайынша ештеңе жіберілмейді.",
  },
  pricing: {
    title: "Бір қарапайым баға. Бауырларыңыз Kinvoice үшін төлемейді.",
    plan: "Күтім жасайтындарға арналған Kinvoice",
    perMonth: "айына",
    firstMonth: "Алғашқы ай тегін",
    features: [
      "Шексіз жазбалар, чектер және ЖИ жобалары",
      "Әр бауырға айлық шот сілтемесі",
      "Сомасы толтырылған Venmo, PayPal және Zelle батырмалары",
      "Бүкіл ай бір экранда: ақша мен уақыт қатар",
    ],
    cta: "Тегін айды бастау",
    note: "Алдымен демоны көріңіз. Картасыз, тіркелусіз.",
    siblingsTitle: "Бауырларға — тегін",
    siblingsBody: "Олар тек сілтемені ашады. Ештеңе жүктемейді, аккаунт пен құпиясөз жоқ.",
  },
  trust: {
    title: "Ақша туралы — сабырмен. Ананың деректеріне — ұқыпты.",
    points: [
      { title: "Медициналық жазба жоқ", body: "Тек сома, санат және қысқа жазба." },
      { title: "Аккаунт пен құпиясөз жоқ", body: "Ешкім таба алмайтын жеке сілтемелер." },
      { title: "Бәрін өшіру", body: "Бір рет басу отбасын және барлық сілтемені өшіреді." },
    ],
  },
  close: {
    title: "Сараның айын он секундта көріңіз.",
    cta: "Сараның отбасын көру",
    note: ({ caregiver, amount }) => `Анамызға ${amount} жібердім. Бәрін көтеріп жүргеніңе рахмет, ${caregiver}!`,
  },
  footer: { line: "Kinvoice. Business Cup 2.0 үшін жасалды, Назарбаев Университеті." },
};

const COPY: Record<Locale, LandingCopy> = { en, ru, kk };

export function landingCopy(locale: Locale): LandingCopy {
  return COPY[locale];
}
