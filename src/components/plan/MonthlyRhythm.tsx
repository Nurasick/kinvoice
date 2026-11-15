"use client";
/**
 * Dashboard: why the caregiver comes back. A monthly calendar reminder (an .ics file, no account
 * needed), the "next month starts fresh" line once everyone has settled, and the plan status.
 */
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { monthLabel } from "@/components/log/labels";
import { useLocale } from "@/lib/i18n/client";
import { formatCents } from "@/lib/money";
import { Button, Card } from "@/components/ui";
import { planCopy } from "./copy";
import { monthlyReminderIcs, nextFirstOfMonth, nextMonth, PLAN_PRICE_CENTS, trialDaysLeft } from "./plan";
import { usePlan } from "./use-plan";

const noSubscribe = (): (() => void) => () => {};

export function MonthlyRhythm({ month, isSettled }: { month: string; isSettled: boolean }) {
  const { view } = useWorkspace();
  const { locale } = useLocale();
  const t = planCopy(locale).rhythm;
  const { isActive } = usePlan(view.workspace.id);
  const days = useSyncExternalStore(
    noSubscribe,
    () => trialDaysLeft(view.workspace.createdAt, new Date()),
    () => trialDaysLeft(view.workspace.createdAt, new Date(view.workspace.createdAt)),
  );
  const title = isSettled
    ? t.settledTitle({ month: monthLabel(month, locale), next: monthLabel(nextMonth(month), locale) })
    : t.title;

  const downloadReminder = (): void => {
    const now = new Date();
    const ics = monthlyReminderIcs({
      title: t.reminderTitle({ parent: view.workspace.parentName }),
      description: t.reminderBody,
      // The dashboard, never the private edit link: calendars sync to other services.
      url: `${window.location.origin}/app`,
      startDate: nextFirstOfMonth(now),
      uid: `${view.workspace.id}-monthly@kinvoice`,
      now,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kinvoice-monthly-reminder.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <h2 className="font-display text-lg font-medium">{title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t.body}</p>
          <p className="mt-2 text-sm text-ink-muted">
            {isActive ? t.planActive : t.planLine({ days, price: formatCents(PLAN_PRICE_CENTS) })} ·{" "}
            <Link href="/app/settings#plan" className="font-medium text-accent underline underline-offset-4">
              {t.planLink}
            </Link>
          </p>
        </div>
        <Button variant="secondary" onClick={downloadReminder}>
          {t.remind}
        </Button>
      </div>
    </Card>
  );
}
