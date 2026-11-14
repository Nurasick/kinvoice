import type { Metadata } from "next";
import { appFontVars } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinvoice",
  description: "Monthly care invoices for siblings sharing an aging parent's care.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${appFontVars} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
