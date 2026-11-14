"use client";
/**
 * UI language for client components. Owner: Nurali.
 *
 *   const { locale, setLocale } = useLocale();
 *
 * `setLocale` remembers the choice (cookie), puts ?lang= in the URL (other parameters kept) and
 * re-renders the server parts of the page, so one switch changes the landing, the app and /i.
 * `rememberLocale` does the same without navigating, for switchers that are already links.
 */
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, withLocale, type Locale } from "./locales";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  rememberLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  rememberLocale: () => {},
});

function persist(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  document.documentElement.lang = locale;
}

export function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const router = useRouter();
  const [locale, setState] = useState<Locale>(initial);

  const rememberLocale = useCallback((next: Locale) => {
    persist(next);
    setState(next);
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      rememberLocale(next);
      const { pathname, search, hash } = window.location;
      router.replace(withLocale(`${pathname}${search}${hash}`, next), { scroll: false });
      router.refresh();
    },
    [rememberLocale, router],
  );

  const value = useMemo(() => ({ locale, setLocale, rememberLocale }), [locale, setLocale, rememberLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
