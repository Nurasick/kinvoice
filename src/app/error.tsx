"use client";
// Owner: Yernur. Unexpected error outside the caregiver app (landing, setup, public invoice).
import { Logo } from "@/components/layout/Logo";
import { StatePanel } from "@/components/layout/StatePanel";
import { Button } from "@/components/ui";

export default function RootError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="flex flex-1 flex-col px-4 sm:px-8">
      <header className="mx-auto w-full max-w-5xl py-5">
        <Logo />
      </header>
      <main className="flex-1">
        <StatePanel
          title="Something didn’t load"
          body={<p>Nothing you entered was lost. This is usually a brief connection hiccup.</p>}
          action={<Button onClick={() => retry()}>Try again</Button>}
          home={{ href: "/", label: "Go to Kinvoice" }}
        />
      </main>
    </div>
  );
}
