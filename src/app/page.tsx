"use client";
// Owner: Yernur. Landing page. Placeholder: the demo button already works end-to-end.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publicApi } from "@/lib/api/client";
import { saveWorkspaceKey } from "@/lib/workspace-key";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function tryDemo(): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      const { editKey } = await publicApi.createDemo();
      saveWorkspaceKey(editKey);
      router.push("/app");
    } catch {
      setError("Couldn't open the demo. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold">Kinvoice</h1>
      <p className="text-lg">One clear monthly care invoice for your siblings. They open a link, see what Mom&apos;s care cost, and chip in.</p>
      <div className="flex gap-3">
        <button className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" onClick={tryDemo} disabled={isLoading}>
          {isLoading ? "Opening…" : "Try Sarah's family"}
        </button>
        <Link className="rounded border px-4 py-2" href="/setup">Start your own</Link>
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </main>
  );
}
