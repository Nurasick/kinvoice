"use client";
/** Settings: family details, members, private link, this device, delete. Owner: Yernur. */
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { clearWorkspaceKey, editLink } from "@/lib/workspace-key";
import { Badge, Button, Card, CopyButton } from "@/components/ui";
import { DeleteFamily } from "./DeleteFamily";
import { FamilyDetailsForm } from "./FamilyDetailsForm";

const noSubscribe = (): (() => void) => () => {};

export function SettingsScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium sm:text-4xl">Settings</h1>
        <p className="mt-1 text-ink-muted">Your family space, your private link, and this device.</p>
      </div>
      <FamilyDetailsForm />
      <Members />
      <PrivateLink />
      <DeleteFamily />
    </div>
  );
}

function Members() {
  const { view } = useWorkspace();
  return (
    <Card>
      <h2 className="font-display text-lg font-medium">Family members</h2>
      <ul className="mt-3 flex flex-col divide-y divide-line">
        {view.members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <span className="font-medium text-ink">
              {m.name}
              {m.email && <span className="ml-2 text-sm font-normal text-ink-muted">{m.email}</span>}
            </span>
            <Badge tone={m.role === "caregiver" ? "accent" : "neutral"}>
              {m.role === "caregiver" ? "Caregiver" : "Sibling"}
            </Badge>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">
        Members can’t be changed yet. To share care with a different group, start a new family space.
      </p>
    </Card>
  );
}

function PrivateLink() {
  const { editKey } = useWorkspace();
  const router = useRouter();
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );
  const link = editLink(origin, editKey);

  function forgetDevice(): void {
    clearWorkspaceKey();
    router.replace("/");
  }

  return (
    <Card>
      <h2 className="font-display text-lg font-medium">Your private link</h2>
      <p className="mt-1 text-sm text-ink-muted">
        This link is your key. Open it on another device to get back in. Keep it to yourself: siblings get
        their own read-only link with each invoice.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 truncate rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink-soft">
          {link}
        </code>
        <CopyButton value={link} label="Copy link" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <p className="min-w-0 flex-1 text-sm text-ink-muted">
          On a shared computer? Forget this device. Your data stays safe and your private link still works.
        </p>
        <Button variant="secondary" onClick={forgetDevice}>
          Forget this device
        </Button>
      </div>
    </Card>
  );
}
