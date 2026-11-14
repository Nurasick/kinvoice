"use client";
/** Hands the Log screen's dictionary to every component below LogScreen. Owner: Olzhas. */
import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { logCopy, type LogCopy } from "./copy";

interface LogLocale {
  locale: Locale;
  t: LogCopy;
}

const Ctx = createContext<LogLocale>({ locale: DEFAULT_LOCALE, t: logCopy(DEFAULT_LOCALE) });

export function LogCopyProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Ctx.Provider value={{ locale, t: logCopy(locale) }}>{children}</Ctx.Provider>;
}

export function useLogCopy(): LogLocale {
  return useContext(Ctx);
}
