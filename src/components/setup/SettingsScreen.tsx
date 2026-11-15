"use client";
/** Settings: family details, members, private link, this device, delete. Owner: Yernur. */
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { clearWorkspaceKey, editLink } from "@/lib/workspace-key";
import { useLocale } from "@/lib/i18n/client";
import { Badge, Button, Card, CopyButton } from "@/components/ui";
import { setupCopy } from "./copy";
import { DeleteFamily } from "./DeleteFamily";
import { FamilyDetailsForm } from "./FamilyDetailsForm";
import { PlanCard } from "@/components/plan/PlanCard";

const noSubscribe = (): (() => void) => () => {};

export function SettingsScreen() {
  const { locale } = useLocale();
  const t = setupCopy(locale).settings;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium sm:text-4xl">{t.title}</h1>
        <p className="mt-1 text-ink-muted">{t.subtitle}</p>
      </div>
      <PlanCard />
      <FamilyDetailsForm />
      <Members />
      <PrivateLink />
      <DeleteFamily />
    </div>
  );
}

function Members() {
  const { view } = useWorkspace();
  const { locale } = useLocale();
  const t = setupCopy(locale).settings;
  return (
    <Card>
      <h2 className="font-display text-lg font-medium">{t.membersTitle}</h2>
      <ul className="mt-3 flex flex-col divide-y divide-line">
        {view.members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <span className="font-medium text-ink">
              {m.name}
              {m.email && <span className="ml-2 text-sm font-normal text-ink-muted">{m.email}</span>}
            </span>
            <Badge tone={m.role === "caregiver" ? "accent" : "neutral"}>
              {m.role === "caregiver" ? t.caregiver : t.sibling}
            </Badge>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">{t.membersNote}</p>
    </Card>
  );
}

function PrivateLink() {
  const { editKey } = useWorkspace();
  const router = useRouter();
  const { locale } = useLocale();
  const t = setupCopy(locale).settings;
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
      <h2 className="font-display text-lg font-medium">{t.linkTitle}</h2>
      <p className="mt-1 text-sm text-ink-muted">{t.linkBody}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 truncate rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink-soft">
          {link}
        </code>
        <CopyButton value={link} label={t.copyLink} copiedLabel={t.copied} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <p className="min-w-0 flex-1 text-sm text-ink-muted">{t.sharedComputer}</p>
        <Button variant="secondary" onClick={forgetDevice}>
          {t.forget}
        </Button>
      </div>
    </Card>
  );
}
