// Owner: Yernur. App shell for the caregiver area.
import Link from "next/link";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-full flex-col">
      <nav className="flex gap-6 border-b px-8 py-4 text-sm">
        <Link href="/app">Dashboard</Link>
        <Link href="/app/log">Log</Link>
        <Link href="/app/invoice">Invoice</Link>
        <Link href="/app/settings">Settings</Link>
      </nav>
      {children}
    </div>
  );
}
