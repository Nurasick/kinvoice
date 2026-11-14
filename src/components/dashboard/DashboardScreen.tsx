"use client";
/**
 * Caregiver dashboard: one month at a glance. Owner: Yernur.
 * One question per block: the headline answers "how is this month going", the progress strip
 * "where am I", Who gave what "is it fair", Where it went "what did it pay for", Recent "did it save".
 */
import { useState } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { monthLabel } from "@/components/log/labels";
import type { Invoice } from "@/shared/domain";
import { Button, EmptyState, LoadingBlock, MonthPicker } from "@/components/ui";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { currentMonth, isEmptyMonth } from "./dashboard-view";
import { MemberBalances } from "./MemberBalances";
import { MonthHeadline } from "./MonthHeadline";
import { MonthProgress } from "./MonthProgress";
import { RecentEntries } from "./RecentEntries";
import { useInvoices } from "./use-invoices";
import { useMonthData, type MonthData } from "./use-month-data";

export function DashboardScreen() {
  const { api, view } = useWorkspace();
  const [thisMonth] = useState(() => currentMonth());
  const [month, setMonth] = useState(thisMonth);
  const { data, reload } = useMonthData(api, month);
  const invoices = useInvoices(api);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{monthLabel(month)}</h1>
          <p className="mt-1 text-sm text-ink-muted">Caring for {view.workspace.parentName}</p>
        </div>
        <MonthPicker month={month} onChange={setMonth} max={thisMonth} />
      </div>
      <MonthBody data={data} month={month} invoices={invoices} onRetry={reload} />
    </div>
  );
}

interface MonthBodyProps {
  data: MonthData;
  month: string;
  invoices: Invoice[] | null;
  onRetry: () => void;
}

function MonthBody({ data, month, invoices, onRetry }: MonthBodyProps) {
  const { view } = useWorkspace();
  if (data.state === "loading" || invoices === null) {
    return <LoadingBlock label={`Loading ${monthLabel(month)}`} />;
  }
  if (data.state === "error") {
    return (
      <EmptyState
        title="We couldn't load this month"
        description="Your data is safe. This is usually a brief connection hiccup."
        action={<Button onClick={onRetry}>Try again</Button>}
      />
    );
  }
  const entries = data.entries.length;
  if (isEmptyMonth(data.balance)) {
    return (
      <>
        <MonthProgress month={month} entries={entries} invoices={invoices} />
        <EmptyState
          title={`Nothing logged for ${monthLabel(month)} yet`}
          description="Type one sentence like “Paid $86 at CVS for Mom’s meds, then drove her to the cardiologist, 3 hours.” and Kinvoice does the rest."
        />
      </>
    );
  }
  return (
    <>
      <MonthHeadline balance={data.balance} month={month} entries={entries} invoices={invoices} />
      <MonthProgress month={month} entries={entries} invoices={invoices} />
      <MemberBalances balance={data.balance} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <CategoryBreakdown balance={data.balance} />
        <RecentEntries entries={data.entries} members={view.members} />
      </div>
    </>
  );
}
