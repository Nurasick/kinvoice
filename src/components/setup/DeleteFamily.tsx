"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { clearWorkspaceKey } from "@/lib/workspace-key";
import { useLocale } from "@/lib/i18n/client";
import { Button, Card, Field, Input } from "@/components/ui";
import { setupCopy } from "./copy";
import { confirmsDelete } from "./settings-draft";

/** Permanent delete, confirmed in-page by typing the parent's name (no browser dialog). */
export function DeleteFamily() {
  const { api, view } = useWorkspace();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [failed, setFailed] = useState(false);
  const parentName = view.workspace.parentName;
  const { locale } = useLocale();
  const t = setupCopy(locale).settings;

  async function remove(): Promise<void> {
    setIsDeleting(true);
    setFailed(false);
    try {
      await api.deleteWorkspace();
      clearWorkspaceKey();
      router.replace("/");
    } catch {
      setFailed(true);
      setIsDeleting(false);
    }
  }

  return (
    <Card tone="flat" className="border-danger/30">
      <h2 className="font-display text-lg font-medium">{t.deleteTitle}</h2>
      <p className="mt-1 text-sm text-ink-muted">{t.deleteBody({ parent: parentName })}</p>
      {!isOpen ? (
        <Button variant="secondary" className="mt-4 text-danger" onClick={() => setIsOpen(true)}>
          {t.deleteOpen}
        </Button>
      ) : (
        <div className="mt-4 flex flex-col gap-3 rounded-[var(--radius-control)] bg-danger-soft p-4">
          <Field label={t.deleteConfirm({ parent: parentName })}>
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
          {failed && (
            <p role="alert" className="text-sm text-danger">
              {t.deleteFailed}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="danger"
              onClick={() => void remove()}
              isLoading={isDeleting}
              disabled={!confirmsDelete(typed, parentName)}
            >
              {t.deleteAll}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                setTyped("");
              }}
            >
              {t.keep}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
