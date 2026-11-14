import type { Metadata } from "next";
import { headers } from "next/headers";
import { appFontVars } from "@/lib/fonts";
import { DEFAULT_LOCALE, isLocale, LOCALE_HEADER } from "@/lib/i18n/locales";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinvoice",
  description: "Monthly care invoices for siblings sharing an aging parent's care.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The proxy sets this only for the translated landing; every other page is English.
  const fromProxy = (await headers()).get(LOCALE_HEADER);
  const lang = isLocale(fromProxy) ? fromProxy : DEFAULT_LOCALE;
  return (
    <html lang={lang} className={`${appFontVars} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
