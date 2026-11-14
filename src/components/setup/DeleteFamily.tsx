"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { clearWorkspaceKey } from "@/lib/workspace-key";
import { Button, Card, Field, Input } from "@/components/ui";
import { confirmsDelete } from "./settings-draft";

/** Permanent delete, confirmed in-page by typing the parent's name (no browser dialog). */
export function DeleteFamily() {
  const { api, view } = useWorkspace();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parentName = view.workspace.parentName;

  async function remove(): Promise<void> {
    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteWorkspace();
      clearWorkspaceKey();
      router.replace("/");
    } catch {
      setError("We couldn't delete it just now. Nothing was removed. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <Card tone="flat" className="border-danger/30">
      <h2 className="font-display text-lg font-medium">Delete this family space</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Permanently removes every entry, invoice and payment note for {parentName}. Links you sent to siblings
        stop working. This can’t be undone.
      </p>
      {!isOpen ? (
        <Button variant="secondary" className="mt-4 text-danger" onClick={() => setIsOpen(true)}>
          Delete family space…
        </Button>
      ) : (
        <div className="mt-4 flex flex-col gap-3 rounded-[var(--radius-control)] bg-danger-soft p-4">
          <Field label={`Type “${parentName}” to confirm`}>
            {(p) => (
              <Input
                {...p}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoFocus
              />
            )}
          </Field>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="danger"
              onClick={() => void remove()}
              isLoading={isDeleting}
              disabled={!confirmsDelete(typed, parentName)}
            >
              Delete everything
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                setTyped("");
              }}
            >
              Keep it
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
