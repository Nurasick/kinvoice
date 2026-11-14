"use client";
// Owner: Yernur. Last resort when the root layout itself fails: renders its own document.
import "./globals.css";

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
        <title>Kinvoice</title>
        <main className="flex max-w-md flex-col gap-4">
          <h1 className="font-display text-3xl font-medium">Kinvoice didn’t load</h1>
          <p className="text-ink-soft">Nothing you entered was lost. Please try again in a moment.</p>
          <div>
            <button
              type="button"
              onClick={() => retry()}
              className="h-10 rounded-[var(--radius-control)] bg-accent px-4 text-sm font-medium text-accent-ink"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
