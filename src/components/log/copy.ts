/**
 * Every word on the Log screen, in English, Russian and Kazakh. Owner: Olzhas.
 * Money stays USD ($); only words, dates and time units change.
 */
import type { Locale } from "@/lib/i18n/locales";
import type { FormErrors } from "./draft-form";

export type ErrorCopy = Required<FormErrors> & { generic: string };

export interface LogCopy {
  page: { title: string; subtitle: string };
  optional: string;
  quick: { title: string; hint: string; example: string; tryExample: string; submit: string; busy: string };
  receipt: { title: string; hint: string; add: string; busy: string; tooBig: string; badType: string; fileLabel: string };
  form: { title: string; addExpense: string; addTime: string };
  drafts: {
    title: string;
    hint: string;
    badge: { quick_log: string; receipt: string; manual: string };
    discard: string;
    discardAll: string;
    confirmOne: string;
    confirmAll: (n: number) => string;
  };
  card: {
    kind: string; expense: string; time: string; amount: string; where: string; wherePlaceholder: string;
    howLong: string; hoursHint: string; hours: string; minutes: string; h: string; min: string;
    category: string; date: string; paidBy: string; givenBy: string; you: string; note: string; notePlaceholder: string;
  };
  errors: ErrorCopy;
  notice: {
    missing: string; saved: (n: number) => string; saveFailed: string;
    quickFallback: string; aiDown: string; receiptPartial: string; receiptFailed: string;
  };
  list: {
    title: string; prevMonth: string; nextMonth: string; loading: (month: string) => string;
    loadErrorTitle: string; loadErrorHint: string; retry: string; emptyTitle: string; emptyHint: string;
    edit: string; delete: string; deleteQ: string; keep: string; cancel: string; save: string;
    saveError: string; deleteError: string; someone: string;
  };
  categories: Record<string, string>;
}

const en: LogCopy = {
  page: { title: "Log care", subtitle: "Money spent and time given. Everything is a draft until you confirm it." },
  optional: "(optional)",
  quick: {
    title: "What happened?",
    hint: "Write it like a text message. We'll turn it into entries for you to check.",
    example: "Paid $86 at CVS for Mom's meds, then drove her to the cardiologist, 3 hours.",
    tryExample: "Try an example",
    submit: "Turn into entries",
    busy: "Reading your note…",
  },
  receipt: {
    title: "Have a receipt?",
    hint: "Snap a photo or upload a PDF. We'll fill in the amount for you to check.",
    add: "Add a receipt",
    busy: "Reading the receipt…",
    tooBig: "That file is over 5 MB — try a smaller photo.",
    badType: "Please use a photo (JPG, PNG, WebP, HEIC) or a PDF.",
    fileLabel: "Receipt file",
  },
  form: { title: "Prefer a form?", addExpense: "Add expense", addTime: "Add time" },
  drafts: {
    title: "Check and confirm",
    hint: "Nothing is saved until you confirm. Edit anything that looks off.",
    badge: { quick_log: "From your note", receipt: "From your receipt", manual: "New entry" },
    discard: "Discard",
    discardAll: "Discard all",
    confirmOne: "Confirm entry",
    confirmAll: (n) => `Confirm all ${n}`,
  },
  card: {
    kind: "Entry type", expense: "Money spent", time: "Time given", amount: "Amount ($)", where: "Where",
    wherePlaceholder: "e.g. CVS", howLong: "How long", hoursHint: "Hours can be decimal, e.g. 1.5", hours: "Hours",
    minutes: "Minutes", h: "h", min: "min", category: "Category", date: "Date", paidBy: "Paid by", givenBy: "Given by",
    you: "(you)", note: "Note", notePlaceholder: "Short note — no medical records",
  },
  errors: {
    date: "Pick a date", memberId: "Choose who", category: "Pick a category", note: "Keep the note under 280 characters",
    amount: "Enter an amount, like 86 or 12.50", duration: "Enter how long, up to 24 hours", generic: "Please check this entry",
  },
  notice: {
    missing: "A few details are missing — check the highlighted fields.",
    saved: (n) => (n === 1 ? "Saved 1 entry." : `Saved ${n} entries.`),
    saveFailed: "Couldn't save just now. Your cards are still here — try again in a moment.",
    quickFallback: "I couldn't read all of that — I filled in what I could. Please check the card below.",
    aiDown: "The assistant is taking a break — you can enter it here instead.",
    receiptPartial: "Some of the receipt was hard to read — please check the amount.",
    receiptFailed: "I couldn't read that receipt — you can enter it here.",
  },
  list: {
    title: "Logged entries", prevMonth: "Previous month", nextMonth: "Next month", loading: (m) => `Loading ${m}`,
    loadErrorTitle: "We couldn't load your entries", loadErrorHint: "Your data is safe. This is usually a brief connection hiccup.",
    retry: "Try again", emptyTitle: "Nothing logged this month yet", emptyHint: "Your first note above is all it takes.",
    edit: "Edit", delete: "Delete", deleteQ: "Delete?", keep: "Keep", cancel: "Cancel", save: "Save changes",
    saveError: "Couldn't save just now — please try again.", deleteError: "Couldn't delete that entry just now — please try again.",
    someone: "Someone",
  },
  categories: {
    medication: "Medication", medical: "Medical", groceries: "Groceries", transport: "Transport", household: "Household",
    home_care: "Home care", insurance: "Insurance", appointments: "Appointments", errands: "Errands",
    personal_care: "Personal care", companionship: "Companionship", admin: "Paperwork & admin", other: "Other",
  },
};

const RU_PLURAL = new Intl.PluralRules("ru");

const ru: LogCopy = {
  page: { title: "Учёт ухода", subtitle: "Потраченные деньги и время. Всё остаётся черновиком, пока вы не подтвердите." },
  optional: "(необязательно)",
  quick: {
    title: "Что случилось?",
    hint: "Напишите как сообщение — мы превратим его в записи, а вы проверите.",
    example: "Заплатила $86 в CVS за мамины лекарства, потом отвезла её к кардиологу, 3 часа.",
    tryExample: "Попробовать пример",
    submit: "Превратить в записи",
    busy: "Читаем заметку…",
  },
  receipt: {
    title: "Есть чек?",
    hint: "Сфотографируйте или загрузите PDF — мы заполним сумму, а вы проверите.",
    add: "Добавить чек",
    busy: "Читаем чек…",
    tooBig: "Файл больше 5 МБ — попробуйте фото поменьше.",
    badType: "Нужно фото (JPG, PNG, WebP, HEIC) или PDF.",
    fileLabel: "Файл чека",
  },
  form: { title: "Удобнее форма?", addExpense: "Добавить расход", addTime: "Добавить время" },
  drafts: {
    title: "Проверьте и подтвердите",
    hint: "Без вашего подтверждения ничего не сохранится. Исправьте, если что-то не так.",
    badge: { quick_log: "Из заметки", receipt: "Из чека", manual: "Новая запись" },
    discard: "Убрать",
    discardAll: "Убрать все",
    confirmOne: "Подтвердить запись",
    confirmAll: (n) => `Подтвердить все (${n})`,
  },
  card: {
    kind: "Тип записи", expense: "Потрачено", time: "Уделённое время", amount: "Сумма ($)", where: "Где",
    wherePlaceholder: "например, CVS", howLong: "Сколько времени", hoursHint: "Часы можно дробью, например 1.5",
    hours: "Часы", minutes: "Минуты", h: "ч", min: "мин", category: "Категория", date: "Дата", paidBy: "Кто платил",
    givenBy: "Кто помогал", you: "(вы)", note: "Заметка", notePlaceholder: "Коротко — без медицинских данных",
  },
  errors: {
    date: "Выберите дату", memberId: "Выберите, кто", category: "Выберите категорию", note: "Заметка — до 280 символов",
    amount: "Введите сумму, например 86 или 12.50", duration: "Укажите время, до 24 часов", generic: "Проверьте эту запись",
  },
  notice: {
    missing: "Не хватает пары деталей — проверьте выделенные поля.",
    saved: (n) => {
      const form = RU_PLURAL.select(n);
      if (form === "one") return `Сохранена ${n} запись.`;
      return form === "few" ? `Сохранено ${n} записи.` : `Сохранено ${n} записей.`;
    },
    saveFailed: "Не получилось сохранить. Карточки на месте — попробуйте чуть позже.",
    quickFallback: "Не всё удалось разобрать — заполнили, что смогли. Проверьте карточку ниже.",
    aiDown: "Помощник сейчас недоступен — можно ввести вручную здесь.",
    receiptPartial: "Часть чека трудно прочитать — проверьте сумму.",
    receiptFailed: "Не удалось прочитать чек — введите его здесь.",
  },
  list: {
    title: "Записи", prevMonth: "Предыдущий месяц", nextMonth: "Следующий месяц", loading: (m) => `Загружаем: ${m}`,
    loadErrorTitle: "Не удалось загрузить записи", loadErrorHint: "Ваши данные в сохранности. Обычно это короткий сбой связи.",
    retry: "Повторить", emptyTitle: "В этом месяце пока нет записей", emptyHint: "Достаточно первой заметки выше.",
    edit: "Изменить", delete: "Удалить", deleteQ: "Удалить?", keep: "Оставить", cancel: "Отмена", save: "Сохранить",
    saveError: "Не получилось сохранить — попробуйте ещё раз.", deleteError: "Не получилось удалить запись — попробуйте ещё раз.",
    someone: "Кто-то",
  },
  categories: {
    medication: "Лекарства", medical: "Медицина", groceries: "Продукты", transport: "Транспорт", household: "Хозяйство",
    home_care: "Уход на дому", insurance: "Страховка", appointments: "Визиты к врачу", errands: "Поручения",
    personal_care: "Личный уход", companionship: "Общение", admin: "Документы и дела", other: "Другое",
  },
};

const kk: LogCopy = {
  page: { title: "Күтім есебі", subtitle: "Жұмсалған ақша мен берілген уақыт. Сіз растамайынша бәрі жоба болып қалады." },
  optional: "(міндетті емес)",
  quick: {
    title: "Не болды?",
    hint: "Хабарлама сияқты жазыңыз — біз оны жазбаларға айналдырамыз, сіз тексересіз.",
    example: "Анамның дәрілері үшін CVS-те $86 төледім, содан кейін оны кардиологқа апардым, 3 сағат.",
    tryExample: "Мысалды қолдану",
    submit: "Жазбаларға айналдыру",
    busy: "Жазбаңызды оқып жатырмыз…",
  },
  receipt: {
    title: "Чек бар ма?",
    hint: "Суретке түсіріңіз не PDF жүктеңіз — сомасын біз толтырамыз, сіз тексересіз.",
    add: "Чек қосу",
    busy: "Чекті оқып жатырмыз…",
    tooBig: "Файл 5 МБ-тан үлкен — кішірек сурет қолданыңыз.",
    badType: "Сурет (JPG, PNG, WebP, HEIC) не PDF қолданыңыз.",
    fileLabel: "Чек файлы",
  },
  form: { title: "Форма ыңғайлы ма?", addExpense: "Шығын қосу", addTime: "Уақыт қосу" },
  drafts: {
    title: "Тексеріп, растаңыз",
    hint: "Сіз растамайынша ештеңе сақталмайды. Дұрыс емес нәрсені түзетіңіз.",
    badge: { quick_log: "Жазбаңыздан", receipt: "Чектен", manual: "Жаңа жазба" },
    discard: "Алып тастау",
    discardAll: "Барлығын алып тастау",
    confirmOne: "Жазбаны растау",
    confirmAll: (n) => `Барлығын растау (${n})`,
  },
  card: {
    kind: "Жазба түрі", expense: "Жұмсалған ақша", time: "Берілген уақыт", amount: "Сома ($)", where: "Қай жерде",
    wherePlaceholder: "мысалы, CVS", howLong: "Қанша уақыт", hoursHint: "Сағатты бөлшекпен жазуға болады, мысалы 1.5",
    hours: "Сағат", minutes: "Минут", h: "сағ", min: "мин", category: "Санат", date: "Күні", paidBy: "Кім төледі",
    givenBy: "Кім көмектесті", you: "(сіз)", note: "Ескертпе", notePlaceholder: "Қысқаша — медициналық деректерсіз",
  },
  errors: {
    date: "Күнін таңдаңыз", memberId: "Кім екенін таңдаңыз", category: "Санатты таңдаңыз", note: "Ескертпе 280 таңбадан аспасын",
    amount: "Соманы енгізіңіз, мысалы 86 не 12.50", duration: "Уақытты енгізіңіз, 24 сағатқа дейін", generic: "Бұл жазбаны тексеріңіз",
  },
  notice: {
    missing: "Кейбір мәліметтер жетіспейді — белгіленген өрістерді тексеріңіз.",
    saved: (n) => `${n} жазба сақталды.`,
    saveFailed: "Қазір сақтау мүмкін болмады. Карточкалар орнында — сәлден соң қайталаңыз.",
    quickFallback: "Барлығын түсіну мүмкін болмады — қолдан келгенін толтырдық. Төмендегі карточканы тексеріңіз.",
    aiDown: "Көмекші қазір қолжетімсіз — мұнда қолмен енгізуге болады.",
    receiptPartial: "Чектің бір бөлігі анық емес — соманы тексеріңіз.",
    receiptFailed: "Чекті оқу мүмкін болмады — оны мұнда енгізіңіз.",
  },
  list: {
    title: "Жазбалар", prevMonth: "Алдыңғы ай", nextMonth: "Келесі ай", loading: (m) => `Жүктелуде: ${m}`,
    loadErrorTitle: "Жазбаларды жүктеу мүмкін болмады", loadErrorHint: "Деректеріңіз қауіпсіз. Әдетте бұл байланыстың қысқа үзілісі.",
    retry: "Қайталау", emptyTitle: "Бұл айда әзірге жазба жоқ", emptyHint: "Жоғарыдағы алғашқы жазба жеткілікті.",
    edit: "Өзгерту", delete: "Жою", deleteQ: "Жою керек пе?", keep: "Қалдыру", cancel: "Болдырмау", save: "Сақтау",
    saveError: "Сақтау мүмкін болмады — қайталап көріңіз.", deleteError: "Жазбаны жою мүмкін болмады — қайталап көріңіз.",
    someone: "Біреу",
  },
  categories: {
    medication: "Дәрі-дәрмек", medical: "Медициналық шығын", groceries: "Азық-түлік", transport: "Көлік", household: "Үй шаруасы",
    home_care: "Үйде күтім", insurance: "Сақтандыру", appointments: "Дәрігерге бару", errands: "Тапсырмалар",
    personal_care: "Жеке күтім", companionship: "Бірге уақыт өткізу", admin: "Құжаттар", other: "Басқа",
  },
};

const COPY: Record<Locale, LogCopy> = { en, ru, kk };

export function logCopy(locale: Locale): LogCopy {
  return COPY[locale];
}
