"use client";
/** Caregiver dashboard: one month at a glance. Owner: Yernur. */
import Link from "next/link";
import { useState } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { monthLabel } from "@/components/log/labels";
import { Button, EmptyState, LoadingBlock, MonthPicker, buttonClass } from "@/components/ui";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { currentMonth, isEmptyMonth } from "./dashboard-view";
import { MemberBalances } from "./MemberBalances";
import { MonthSummary } from "./MonthSummary";
import { RecentEntries } from "./RecentEntries";
import { useMonthData, type MonthData } from "./use-month-data";

export function DashboardScreen() {
  const { api, view } = useWorkspace();
  const [thisMonth] = useState(() => currentMonth());
  const [month, setMonth] = useState(thisMonth);
  const { data, reload } = useMonthData(api, month);
  const canInvoice = data.state === "ready" && data.balance.totalOutOfPocketCents > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Caring for {view.workspace.parentName}</p>
          <h1 className="mt-1 font-display text-3xl font-medium sm:text-4xl">{monthLabel(month)}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MonthPicker month={month} onChange={setMonth} max={thisMonth} />
          {canInvoice && (
            <Link href={`/app/invoice?month=${month}`} className={buttonClass("primary")}>
              Create invoice
            </Link>
          )}
        </div>
      </div>
      <MonthBody data={data} month={month} onRetry={reload} />
    </div>
  );
}

function MonthBody({ data, month, onRetry }: { data: MonthData; month: string; onRetry: () => void }) {
  const { view } = useWorkspace();
  if (data.state === "loading") return <LoadingBlock label={`Loading ${monthLabel(month)}`} />;
  if (data.state === "error") {
    return (
      <EmptyState
        title="We couldn't load this month"
        description="Your data is safe. This is usually a brief connection hiccup."
        action={<Button onClick={onRetry}>Try again</Button>}
      />
    );
  }
  if (isEmptyMonth(data.balance)) {
    return (
      <EmptyState
        title={`Nothing logged for ${monthLabel(month)} yet`}
        description="Type one sentence like “Paid $86 at CVS for Mom’s meds, then drove her to the cardiologist, 3 hours.” and Kinvoice does the rest."
        action={
          <Link href="/app/log" className={buttonClass("primary")}>
            Log care
          </Link>
        }
      />
    );
  }
  return (
    <>
      <MonthSummary balance={data.balance} />
      <MemberBalances balance={data.balance} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <CategoryBreakdown balance={data.balance} />
        <RecentEntries entries={data.entries} members={view.members} />
      </div>
    </>
  );
}
