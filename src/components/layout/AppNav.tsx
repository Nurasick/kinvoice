"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

interface NavItem {
  href: string;
  label: string;
}

const NAV: readonly NavItem[] = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/log", label: "Log" },
  { href: "/app/invoice", label: "Invoice" },
  { href: "/app/settings", label: "Settings" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="-mx-1 flex gap-1 overflow-x-auto">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active ? "bg-accent-soft text-accent-strong" : "text-ink-muted hover:bg-paper-deep hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
