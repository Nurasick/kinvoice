// Owner: Olzhas. Log care: quick log, receipt, manual form, this month's entries.
import type { Metadata } from "next";
import { LogScreen } from "@/components/log/LogScreen";

export const metadata: Metadata = { title: "Log care · Kinvoice" };

export default function LogPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-medium text-ink">Log care</h1>
        <p className="mt-1 text-ink-muted">Money spent and time given. Everything is a draft until you confirm it.</p>
      </header>
      <LogScreen />
    </>
  );
}
