"use client";
// Owner: Yernur. Family setup → private edit link → dashboard.
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { SetupDone } from "@/components/setup/SetupDone";
import { SetupForm } from "@/components/setup/SetupForm";

export default function SetupPage() {
  const [editKey, setEditKey] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 sm:px-8">
        {editKey ? (
          <SetupDone editKey={editKey} />
        ) : (
          <>
            <h1 className="font-display text-3xl font-medium sm:text-4xl">Set up your family</h1>
            <p className="mt-3 mb-8 text-ink-soft">
              About two minutes. No account, no password. You can change all of this later.
            </p>
            <SetupForm onCreated={setEditKey} />
          </>
        )}
      </main>
    </div>
  );
}
