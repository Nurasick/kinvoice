"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publicApi } from "@/lib/api/client";
import { saveWorkspaceKey } from "@/lib/workspace-key";
import { Button, type ButtonSize } from "@/components/ui";

/** Creates a fresh private copy of Sarah's demo family and opens the dashboard. */
export function TryDemoButton({ size = "lg" }: { size?: ButtonSize }) {
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
      setError("We couldn't open the demo just now. Please try again in a moment.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size={size} onClick={() => void tryDemo()} isLoading={isLoading}>
        {isLoading ? "Opening Sarah's family" : "Try Sarah's family"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
