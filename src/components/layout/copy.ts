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
};

const COPY: Record<Locale, FrameCopy> = { en, ru, kk };

export function frameCopy(locale: Locale): FrameCopy {
  return COPY[locale];
}
