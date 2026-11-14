"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/client";
import { cn } from "@/components/ui";
import { frameCopy, type FrameCopy } from "./copy";

interface NavItem {
  href: string;
  key: keyof Omit<FrameCopy["nav"], "label">;
}

const NAV: readonly NavItem[] = [
  { href: "/app", key: "dashboard" },
  { href: "/app/log", key: "log" },
  { href: "/app/invoice", key: "invoice" },
  { href: "/app/settings", key: "settings" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function AppNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const copy = frameCopy(locale).nav;
  return (
    <nav aria-label={copy.label} className="-m-1.5 flex gap-1 overflow-x-auto p-1.5">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active ? "bg-white text-enamel-deep" : "text-on-enamel-soft hover:bg-white/10 hover:text-white",
            )}
          >
            {copy[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
