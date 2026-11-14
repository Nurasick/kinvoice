"use client";
// Owner: Yernur. Unexpected error inside the caregiver app; the header and nav stay usable.
import { StatePanel } from "@/components/layout/StatePanel";
import { Button } from "@/components/ui";

export default function AppError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <StatePanel
      title="This page hit a snag"
      body={<p>Your family’s data is safe. Try again, or pick another page from the menu above.</p>}
      action={<Button onClick={() => retry()}>Try again</Button>}
      home={{ href: "/app", label: "Back to dashboard" }}
    />
  );
}
