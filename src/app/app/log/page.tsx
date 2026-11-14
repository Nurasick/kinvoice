// Owner: Olzhas. Log care: quick log, receipt, manual form, this month's entries.
import type { Metadata } from "next";
import { LogScreen } from "@/components/log/LogScreen";

export const metadata: Metadata = { title: "Log care · Kinvoice" };

export default function LogPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Log care</h1>
        <p className="mt-1 text-sm opacity-70">Money spent and time given. Everything is a draft until you confirm it.</p>
      </header>
      <LogScreen />
    </main>
  );
}
