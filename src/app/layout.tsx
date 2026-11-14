import type { Metadata } from "next";
import { appFontVars } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/i18n/client";
import { getRequestLocale } from "@/lib/i18n/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinvoice",
  description: "Monthly care invoices for siblings sharing an aging parent's care.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getRequestLocale();
  return (
    <html lang={locale} className={`${appFontVars} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
