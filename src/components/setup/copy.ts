/**
 * Setup and Settings copy in English, Russian and Kazakh. Owner: Yernur.
 * Validation (setup-draft.ts, settings-draft.ts) returns codes; these dictionaries word them.
 * Rules: "suggested contribution", never "owe". Russian avoids gendered verbs.
 */
import type { Locale } from "@/lib/i18n/locales";

type Fn<P> = (p: P) => string;

/** Validation and save outcomes, worded per language below. */
export type FormErrorCode =
  | "parentMissing"
  | "parentMissingShort"
  | "caregiverMissing"
  | "noSiblings"
  | "siblingNameMissing"
  | "emailInvalid"
  | "rateRange"
  | "tooLong"
  | "setupFailed"
  | "saveFailed";

export interface SetupCopy {
  fields: {
    optional: string;
    parentName: string;
    perHour: string;
    venmo: string;
    paypal: string;
    zelle: string;
  };
  errors: Record<FormErrorCode, string>;
  setup: {
    title: string;
    intro: string;
    whoTitle: string;
    whoBody: string;
    parentPlaceholder: string;
    yourName: string;
    siblingsTitle: string;
    siblingsBody: string;
    sibling: Fn<{ n: number }>;
    email: string;
    remove: string;
    removeSr: Fn<{ n: number }>;
    addSibling: string;
    timeTitle: string;
    timeBody: string;
    payTitle: string;
    payBody: string;
    needsLook: string;
    submit: string;
  };
  done: {
    ready: string;
    title: string;
    body: string;
    copyLink: string;
    copied: string;
    toDashboard: string;
  };
  settings: {
    title: string;
    subtitle: string;
    detailsTitle: string;
    detailsBody: string;
    rateLabel: string;
    rateHint: string;
    payTitle: string;
    save: string;
    discard: string;
    saved: string;
    membersTitle: string;
    caregiver: string;
    sibling: string;
    membersNote: string;
    linkTitle: string;
    linkBody: string;
    copyLink: string;
    copied: string;
    sharedComputer: string;
    forget: string;
    deleteTitle: string;
    deleteBody: Fn<{ parent: string }>;
    deleteOpen: string;
    deleteConfirm: Fn<{ parent: string }>;
    deleteAll: string;
    keep: string;
    deleteFailed: string;
  };
}

const en: SetupCopy = {
  fields: {
    optional: "(optional)",
    parentName: "Parent's name",
    perHour: "/hr",
    venmo: "Venmo username",
    paypal: "PayPal.Me name",
    zelle: "Zelle email or phone",
  },
  errors: {
    parentMissing: "Who are you caring for? A first name is enough.",
    parentMissingShort: "Add a name, even just “Mom”.",
    caregiverMissing: "Add your name so siblings know who sent it.",
    noSiblings: "Add at least one sibling to share the invoice with.",
    siblingNameMissing: "Add a name for this sibling.",
    emailInvalid: "That email doesn't look right.",
    rateRange: "Use an amount between $0 and $100 per hour.",
    tooLong: "Some details are too long. Please shorten them.",
    setupFailed: "We couldn't save your family just now. Your details are still here, so please try again.",
    saveFailed: "We couldn't save just now. Your changes are still here, so please try again.",
  },
  setup: {
    title: "Set up your family",
    intro: "About two minutes. No account, no password. You can change all of this later.",
    whoTitle: "Who you're caring for",
    whoBody: "First names are enough.",
    parentPlaceholder: "Mom, or Linda",
    yourName: "Your name",
    siblingsTitle: "Your siblings",
    siblingsBody: "They'll get a link. They never need an account. Emails are just for your reference.",
    sibling: ({ n }) => `Sibling ${n}`,
    email: "Email",
    remove: "Remove",
    removeSr: ({ n }) => ` sibling ${n}`,
    addSibling: "+ Add a sibling",
    timeTitle: "Value of your time",
    timeBody:
      "Shown next to the money so the time you give is seen. It's never added to anyone's suggested contribution.",
    payTitle: "How siblings can pay you",
    payBody: "Optional. Pay buttons only show for the ones you fill in.",
    needsLook: "A few details need a look above.",
    submit: "Create our family space",
  },
  done: {
    ready: "Your family space is ready",
    title: "Save your private link",
    body: "There are no passwords. This link is your key: bookmark it or save it somewhere safe to get back in from any device. Don’t share it. Siblings get their own read-only link with each invoice.",
    copyLink: "Copy link",
    copied: "Copied",
    toDashboard: "Go to my dashboard",
  },
  settings: {
    title: "Settings",
    subtitle: "Your family space, your private link, and this device.",
    detailsTitle: "Family details",
    detailsBody: "Changes apply to new invoices. Invoices you already sent stay as they were.",
    rateLabel: "Value of an hour of care",
    rateHint: "Shown with time given. Never split.",
    payTitle: "How siblings can pay you",
    save: "Save changes",
    discard: "Discard",
    saved: "Saved.",
    membersTitle: "Family members",
    caregiver: "Caregiver",
    sibling: "Sibling",
    membersNote:
      "Members can’t be changed yet. To share care with a different group, start a new family space.",
    linkTitle: "Your private link",
    linkBody:
      "This link is your key. Open it on another device to get back in. Keep it to yourself: siblings get their own read-only link with each invoice.",
    copyLink: "Copy link",
    copied: "Copied",
    sharedComputer:
      "On a shared computer? Forget this device. Your data stays safe and your private link still works.",
    forget: "Forget this device",
    deleteTitle: "Delete this family space",
    deleteBody: ({ parent }) =>
      `Permanently removes every entry, invoice and payment note for ${parent}. Links you sent to siblings stop working. This can’t be undone.`,
    deleteOpen: "Delete family space…",
    deleteConfirm: ({ parent }) => `Type “${parent}” to confirm`,
    deleteAll: "Delete everything",
    keep: "Keep it",
    deleteFailed: "We couldn't delete it just now. Nothing was removed. Please try again.",
  },
};

const ru: SetupCopy = {
  fields: {
    optional: "(необязательно)",
    parentName: "Имя родителя",
    perHour: "/ч",
    venmo: "Имя в Venmo",
    paypal: "Имя в PayPal.Me",
    zelle: "Email или телефон для Zelle",
  },
  errors: {
    parentMissing: "О ком вы заботитесь? Достаточно имени.",
    parentMissingShort: "Добавьте имя, хотя бы «Мама».",
    caregiverMissing: "Добавьте своё имя, чтобы родные знали, от кого счёт.",
    noSiblings: "Добавьте хотя бы одного брата или сестру, чтобы делиться счётом.",
    siblingNameMissing: "Добавьте имя для этого человека.",
    emailInvalid: "Похоже, в email ошибка.",
    rateRange: "Укажите сумму от $0 до $100 в час.",
    tooLong: "Некоторые поля слишком длинные. Сократите их, пожалуйста.",
    setupFailed: "Сейчас не получилось сохранить семью. Все данные на месте, попробуйте ещё раз.",
    saveFailed: "Сейчас не получилось сохранить. Изменения на месте, попробуйте ещё раз.",
  },
  setup: {
    title: "Настройте свою семью",
    intro: "Около двух минут. Без аккаунта и пароля. Всё можно изменить позже.",
    whoTitle: "О ком вы заботитесь",
    whoBody: "Достаточно имён.",
    parentPlaceholder: "Мама или Линда",
    yourName: "Ваше имя",
    siblingsTitle: "Братья и сёстры",
    siblingsBody: "Они получат ссылку. Аккаунт им не нужен. Email только для вашего удобства.",
    sibling: ({ n }) => `Брат или сестра ${n}`,
    email: "Email",
    remove: "Убрать",
    removeSr: ({ n }) => ` (номер ${n})`,
    addSibling: "+ Добавить брата или сестру",
    timeTitle: "Ценность вашего времени",
    timeBody:
      "Показывается рядом с деньгами, чтобы ваше время было видно. К предлагаемому вкладу оно не добавляется.",
    payTitle: "Как родные могут вам перевести",
    payBody: "Необязательно. Кнопки оплаты появятся только для заполненных способов.",
    needsLook: "Проверьте, пожалуйста, несколько полей выше.",
    submit: "Создать семейное пространство",
  },
  done: {
    ready: "Ваше семейное пространство готово",
    title: "Сохраните личную ссылку",
    body: "Паролей нет. Эта ссылка и есть ваш ключ: добавьте её в закладки или сохраните, чтобы вернуться с любого устройства. Не делитесь ею. Родные получают свою ссылку только для чтения с каждым счётом.",
    copyLink: "Скопировать ссылку",
    copied: "Скопировано",
    toDashboard: "Перейти к обзору",
  },
  settings: {
    title: "Настройки",
    subtitle: "Ваше семейное пространство, личная ссылка и это устройство.",
    detailsTitle: "Данные семьи",
    detailsBody: "Изменения применятся к новым счетам. Уже отправленные останутся как были.",
    rateLabel: "Ценность часа ухода",
    rateHint: "Показывается рядом со временем. Не делится.",
    payTitle: "Как родные могут вам перевести",
    save: "Сохранить изменения",
    discard: "Отменить",
    saved: "Сохранено.",
    membersTitle: "Члены семьи",
    caregiver: "Ухаживает",
    sibling: "Брат или сестра",
    membersNote:
      "Состав семьи пока нельзя изменить. Чтобы делить уход с другими людьми, создайте новое пространство.",
    linkTitle: "Ваша личная ссылка",
    linkBody:
      "Эта ссылка и есть ваш ключ. Откройте её на другом устройстве, чтобы вернуться. Держите её при себе: родные получают свою ссылку только для чтения с каждым счётом.",
    copyLink: "Скопировать ссылку",
    copied: "Скопировано",
    sharedComputer:
      "Общий компьютер? Забудьте это устройство. Данные останутся в сохранности, а личная ссылка продолжит работать.",
    forget: "Забыть это устройство",
    deleteTitle: "Удалить семейное пространство",
    deleteBody: ({ parent }) =>
      `Навсегда удаляет все записи, счета и отметки о переводах (${parent}). Ссылки, отправленные родным, перестанут работать. Отменить это нельзя.`,
    deleteOpen: "Удалить пространство…",
    deleteConfirm: ({ parent }) => `Введите «${parent}» для подтверждения`,
    deleteAll: "Удалить всё",
    keep: "Оставить",
    deleteFailed: "Сейчас не получилось удалить. Ничего не удалено, попробуйте ещё раз.",
  },
};

const kk: SetupCopy = {
  fields: {
    optional: "(міндетті емес)",
    parentName: "Ата-ананың аты",
    perHour: "/сағ",
    venmo: "Venmo аты",
    paypal: "PayPal.Me аты",
    zelle: "Zelle үшін email немесе телефон",
  },
  errors: {
    parentMissing: "Кімге қамқорлық жасайсыз? Аты жеткілікті.",
    parentMissingShort: "Атын қосыңыз, тіпті «Анам» деп.",
    caregiverMissing: "Шоттың кімнен екенін бауырларыңыз білуі үшін атыңызды қосыңыз.",
    noSiblings: "Шотпен бөлісу үшін кемінде бір бауыр қосыңыз.",
    siblingNameMissing: "Бұл бауырдың атын қосыңыз.",
    emailInvalid: "Email қате сияқты.",
    rateRange: "Сағатына $0 мен $100 аралығындағы соманы көрсетіңіз.",
    tooLong: "Кейбір мәліметтер тым ұзын. Қысқартыңыз.",
    setupFailed: "Қазір отбасыңызды сақтау мүмкін болмады. Мәліметтеріңіз сақталған, қайта көріңіз.",
    saveFailed: "Қазір сақтау мүмкін болмады. Өзгерістеріңіз сақталған, қайта көріңіз.",
  },
  setup: {
    title: "Отбасыңызды баптаңыз",
    intro: "Шамамен екі минут. Аккаунтсыз, құпиясөзсіз. Кейін бәрін өзгертуге болады.",
    whoTitle: "Кімге қамқорлық жасайсыз",
    whoBody: "Аттары жеткілікті.",
    parentPlaceholder: "Анам немесе Линда",
    yourName: "Сіздің атыңыз",
    siblingsTitle: "Бауырларыңыз",
    siblingsBody: "Олар сілтеме алады. Аккаунт керек емес. Email тек сізге ыңғайлы болу үшін.",
    sibling: ({ n }) => `Бауыр ${n}`,
    email: "Email",
    remove: "Алып тастау",
    removeSr: ({ n }) => ` (${n}-бауыр)`,
    addSibling: "+ Бауыр қосу",
    timeTitle: "Уақытыңыздың құны",
    timeBody:
      "Берген уақытыңыз көрінсін деп ақшаның қасында көрсетіледі. Ешкімнің ұсынылған үлесіне қосылмайды.",
    payTitle: "Бауырлар сізге қалай аударады",
    payBody: "Міндетті емес. Төлем батырмалары тек толтырылғандары үшін шығады.",
    needsLook: "Жоғарыдағы бірнеше жолды тексеріңіз.",
    submit: "Отбасы кеңістігін құру",
  },
  done: {
    ready: "Отбасы кеңістігіңіз дайын",
    title: "Жеке сілтемеңізді сақтаңыз",
    body: "Құпиясөз жоқ. Бұл сілтеме сіздің кілтіңіз: кез келген құрылғыдан қайта кіру үшін оны бетбелгіге қосыңыз немесе сақтаңыз. Ешкімге бермеңіз. Бауырлар әр шотпен бірге тек оқуға арналған өз сілтемесін алады.",
    copyLink: "Сілтемені көшіру",
    copied: "Көшірілді",
    toDashboard: "Шолуға өту",
  },
  settings: {
    title: "Баптаулар",
    subtitle: "Отбасы кеңістігіңіз, жеке сілтемеңіз және осы құрылғы.",
    detailsTitle: "Отбасы мәліметтері",
    detailsBody: "Өзгерістер жаңа шоттарға қолданылады. Жіберілген шоттар өзгермейді.",
    rateLabel: "Бір сағат күтімнің құны",
    rateHint: "Берілген уақытпен бірге көрсетіледі. Бөлінбейді.",
    payTitle: "Бауырлар сізге қалай аударады",
    save: "Өзгерістерді сақтау",
    discard: "Бас тарту",
    saved: "Сақталды.",
    membersTitle: "Отбасы мүшелері",
    caregiver: "Күтуші",
    sibling: "Бауыр",
    membersNote:
      "Мүшелерді әзірге өзгерту мүмкін емес. Басқа адамдармен бөлісу үшін жаңа отбасы кеңістігін құрыңыз.",
    linkTitle: "Жеке сілтемеңіз",
    linkBody:
      "Бұл сілтеме сіздің кілтіңіз. Қайта кіру үшін оны басқа құрылғыда ашыңыз. Ешкімге бермеңіз: бауырлар әр шотпен бірге тек оқуға арналған өз сілтемесін алады.",
    copyLink: "Сілтемені көшіру",
    copied: "Көшірілді",
    sharedComputer:
      "Ортақ компьютер ме? Бұл құрылғыны ұмытыңыз. Деректеріңіз сақтаулы, ал жеке сілтемеңіз жұмыс істей береді.",
    forget: "Бұл құрылғыны ұмыту",
    deleteTitle: "Отбасы кеңістігін өшіру",
    deleteBody: ({ parent }) =>
      `Барлық жазбаны, шотты және аударым белгілерін біржола өшіреді (${parent}). Бауырларға жіберілген сілтемелер жұмыс істемей қалады. Мұны қайтару мүмкін емес.`,
    deleteOpen: "Кеңістікті өшіру…",
    deleteConfirm: ({ parent }) => `Растау үшін «${parent}» деп жазыңыз`,
    deleteAll: "Бәрін өшіру",
    keep: "Қалдыру",
    deleteFailed: "Қазір өшіру мүмкін болмады. Ештеңе өшірілген жоқ, қайта көріңіз.",
  },
};

const COPY: Record<Locale, SetupCopy> = { en, ru, kk };

export function setupCopy(locale: Locale): SetupCopy {
  return COPY[locale];
}
