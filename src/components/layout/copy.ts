/**
 * App frame copy (nav, skip link, workspace states) in English, Russian and Kazakh. Owner: Yernur.
 * Terms match the landing ("Создать свою семью") and the Log ("Учёт ухода").
 */
import type { Locale } from "@/lib/i18n/locales";

export interface FrameCopy {
  nav: { label: string; dashboard: string; log: string; invoice: string; settings: string };
  skip: string;
  language: string;
  workspace: {
    opening: string;
    missingTitle: string;
    missingBody: string;
    rejectedTitle: string;
    rejectedBody: string;
    tryDemo: string;
    startOwn: string;
    errorTitle: string;
    errorBody: string;
    tryAgain: string;
  };
  /** 404, error boundaries, loading and the edit-link landing. */
  states: {
    notFoundTitle: string;
    notFoundBody: string;
    home: string;
    errorTitle: string;
    errorBody: string;
    appErrorTitle: string;
    appErrorBody: string;
    backToDashboard: string;
    globalTitle: string;
    globalBody: string;
    tryAgain: string;
    loading: string;
    openingSpace: string;
  };
}

const en: FrameCopy = {
  nav: { label: "Main", dashboard: "Dashboard", log: "Log", invoice: "Invoice", settings: "Settings" },
  skip: "Skip to content",
  language: "Language",
  workspace: {
    opening: "Opening your family workspace",
    missingTitle: "No family workspace on this device yet",
    missingBody:
      "Open your private edit link to get back in, or start fresh. You can also look around Sarah's demo family.",
    rejectedTitle: "That private link didn’t work",
    rejectedBody:
      "Check that you copied the whole link. If the family space was deleted, you can start a new one or look around Sarah's demo family.",
    tryDemo: "Try the demo",
    startOwn: "Start your own",
    errorTitle: "We couldn't reach your workspace",
    errorBody: "Your data is safe. This is usually a brief connection hiccup.",
    tryAgain: "Try again",
  },
  states: {
    notFoundTitle: "We couldn’t find that page",
    notFoundBody:
      "The address may be mistyped. If you were opening your family space, use your private link. If a sibling sent you an invoice, ask them for the link again.",
    home: "Go to Kinvoice",
    errorTitle: "Something didn’t load",
    errorBody: "Nothing you entered was lost. This is usually a brief connection hiccup.",
    appErrorTitle: "This page hit a snag",
    appErrorBody: "Your family’s data is safe. Try again, or pick another page from the menu above.",
    backToDashboard: "Back to dashboard",
    globalTitle: "Kinvoice didn’t load",
    globalBody: "Nothing you entered was lost. Please try again in a moment.",
    tryAgain: "Try again",
    loading: "Loading",
    openingSpace: "Opening your family space",
  },
};

const ru: FrameCopy = {
  nav: { label: "Основное меню", dashboard: "Обзор", log: "Учёт", invoice: "Счёт", settings: "Настройки" },
  skip: "Перейти к содержимому",
  language: "Язык",
  workspace: {
    opening: "Открываем ваше семейное пространство",
    missingTitle: "На этом устройстве пока нет семейного пространства",
    missingBody:
      "Откройте свою личную ссылку, чтобы вернуться, или начните заново. Можно также посмотреть демо-семью Сары.",
    rejectedTitle: "Эта личная ссылка не сработала",
    rejectedBody:
      "Проверьте, что скопировали ссылку целиком. Если семейное пространство удалено, создайте новое или посмотрите демо-семью Сары.",
    tryDemo: "Открыть демо",
    startOwn: "Создать свою семью",
    errorTitle: "Не удалось открыть ваше пространство",
    errorBody: "Ваши данные в сохранности. Обычно это кратковременный сбой связи.",
    tryAgain: "Попробовать ещё раз",
  },
  states: {
    notFoundTitle: "Такой страницы нет",
    notFoundBody:
      "Возможно, в адресе опечатка. Если вы открывали своё семейное пространство, воспользуйтесь личной ссылкой. Если счёт прислал кто-то из родных, попросите ссылку ещё раз.",
    home: "Перейти в Kinvoice",
    errorTitle: "Что-то не загрузилось",
    errorBody: "Ничего из введённого не потерялось. Обычно это кратковременный сбой связи.",
    appErrorTitle: "На этой странице сбой",
    appErrorBody:
      "Данные вашей семьи в сохранности. Попробуйте ещё раз или выберите другую страницу в меню выше.",
    backToDashboard: "Вернуться к обзору",
    globalTitle: "Kinvoice не загрузился",
    globalBody: "Ничего из введённого не потерялось. Попробуйте ещё раз чуть позже.",
    tryAgain: "Попробовать ещё раз",
    loading: "Загрузка",
    openingSpace: "Открываем ваше семейное пространство",
  },
};

const kk: FrameCopy = {
  nav: { label: "Негізгі мәзір", dashboard: "Шолу", log: "Жазбалар", invoice: "Шот", settings: "Баптаулар" },
  skip: "Мазмұнға өту",
  language: "Тіл",
  workspace: {
    opening: "Отбасы кеңістігіңіз ашылуда",
    missingTitle: "Бұл құрылғыда әлі отбасы кеңістігі жоқ",
    missingBody:
      "Қайта кіру үшін жеке сілтемеңізді ашыңыз немесе жаңадан бастаңыз. Сараның демо-отбасын да көре аласыз.",
    rejectedTitle: "Бұл жеке сілтеме жұмыс істемеді",
    rejectedBody:
      "Сілтемені толық көшіргеніңізді тексеріңіз. Отбасы кеңістігі өшірілген болса, жаңасын бастаңыз немесе Сараның демо-отбасын қараңыз.",
    tryDemo: "Демоны ашу",
    startOwn: "Өз отбасыңызды құру",
    errorTitle: "Кеңістігіңізді ашу мүмкін болмады",
    errorBody: "Деректеріңіз сақтаулы. Әдетте бұл байланыстың қысқа үзілісі.",
    tryAgain: "Қайта көру",
  },
  states: {
    notFoundTitle: "Мұндай бет жоқ",
    notFoundBody:
      "Мекенжайда қате болуы мүмкін. Отбасы кеңістігіңізді ашқыңыз келсе, жеке сілтемеңізді пайдаланыңыз. Шотты бауырыңыз жіберсе, сілтемені қайта сұраңыз.",
    home: "Kinvoice-қа өту",
    errorTitle: "Бір нәрсе жүктелмеді",
    errorBody: "Енгізгеніңіздің ешқайсысы жоғалған жоқ. Әдетте бұл байланыстың қысқа үзілісі.",
    appErrorTitle: "Бұл бетте ақау шықты",
    appErrorBody:
      "Отбасыңыздың деректері сақтаулы. Қайта көріңіз немесе жоғарыдағы мәзірден басқа бетті таңдаңыз.",
    backToDashboard: "Шолуға оралу",
    globalTitle: "Kinvoice жүктелмеді",
    globalBody: "Енгізгеніңіздің ешқайсысы жоғалған жоқ. Сәлден соң қайта көріңіз.",
    tryAgain: "Қайта көру",
    loading: "Жүктелуде",
    openingSpace: "Отбасы кеңістігіңіз ашылуда",
  },
};

const COPY: Record<Locale, FrameCopy> = { en, ru, kk };

export function frameCopy(locale: Locale): FrameCopy {
  return COPY[locale];
}
