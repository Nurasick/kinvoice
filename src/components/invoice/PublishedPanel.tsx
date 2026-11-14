"use client";
/**
 * Shown right after publishing: one personal link per sibling, ready to send from the caregiver's own
 * phone (Messages, WhatsApp, email) or copy. Kinvoice itself never sends anything.
 */
import type { Invoice, MemberBalance } from "@/shared/domain";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { Button, Card, CopyButton, Money, buttonClass, useOrigin } from "@/components/ui";
import { publicInvoiceUrl } from "./invoice-view";
import { shareLinks } from "./share-links";

export interface PublishedPanelProps {
  invoice: Invoice;
  monthName: string;
  onStartOver: () => void;
}

export function PublishedPanel({ invoice, monthName, onStartOver }: PublishedPanelProps) {
  const origin = useOrigin();
  const siblings = invoice.snapshot.members.filter((m) => m.role === "sibling");
  return (
    <Card tone="accent" className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Your {monthName} invoice is ready to send</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Each sibling gets their own link that opens on their part. They don’t need an account or an app.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {siblings.map((m) => (
          <SiblingShare key={m.memberId} member={m} invoice={invoice} monthName={monthName} origin={origin} />
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2 border-t border-accent/15 pt-4">
        <CopyButton
          value={publicInvoiceUrl(origin, invoice.publicToken)}
          label="Copy family link"
          variant="secondary"
        />
        <a
          href={publicInvoiceUrl(origin, invoice.publicToken)}
          target="_blank"
          rel="noreferrer"
          className={buttonClass("ghost")}
        >
          Preview as a sibling
        </a>
        <Button variant="ghost" onClick={onStartOver}>
          Write another
        </Button>
      </div>
    </Card>
  );
}

interface SiblingShareProps {
  member: MemberBalance;
  invoice: Invoice;
  monthName: string;
  origin: string;
}

function SiblingShare({ member, invoice, monthName, origin }: SiblingShareProps) {
  const { view } = useWorkspace();
  const caregiver = view.members.find((m) => m.role === "caregiver")?.name ?? "";
  const email = view.members.find((m) => m.id === member.memberId)?.email;
  const links = shareLinks({
    origin,
    token: invoice.publicToken,
    memberId: member.memberId,
    siblingName: member.name,
    caregiverName: caregiver,
    parentName: view.workspace.parentName,
    monthName,
    amountCents: member.suggestedContributionCents,
    email,
  });
  return (
    <li className="flex flex-col gap-3 rounded-[var(--radius-control)] bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-ink">{member.name}</p>
        <p className="text-sm text-ink-muted">
          Suggested contribution{" "}
          <Money cents={member.suggestedContributionCents} className="font-semibold text-ink" />
        </p>
      </div>
      <div className="flex flex-wrap gap-2" aria-label={`Send ${member.name} their link`} role="group">
        <a href={links.sms} className={buttonClass("primary", "sm")}>
          Text
        </a>
        <a href={links.whatsapp} target="_blank" rel="noreferrer" className={buttonClass("secondary", "sm")}>
          WhatsApp
        </a>
        <a href={links.email} className={buttonClass("secondary", "sm")}>
          Email
        </a>
        <CopyButton value={links.message} label="Copy" variant="secondary" size="sm" />
      </div>
    </li>
  );
}
