"use client";
/**
 * Caregiver dashboard: one month at a glance. Owner: Yernur.
 * One question per block: the headline answers "how is this month going", the progress strip
 * "where am I", Who gave what "is it fair", Where it went "what did it pay for", Recent "did it save".
 */
import { useState } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { monthLabel } from "@/components/log/labels";
import { useLocale } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/locales";
import { dashboardCopy } from "./copy";
import type { Invoice } from "@/shared/domain";
import { Button, EmptyState, LoadingBlock, MonthPicker } from "@/components/ui";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { currentMonth, isEmptyMonth } from "./dashboard-view";
import { MemberBalances } from "./MemberBalances";
import { MonthHeadline } from "./MonthHeadline";
import { latestInvoice } from "./month-progress";
import { MonthProgress } from "./MonthProgress";
import { RecentEntries } from "./RecentEntries";
import { settlement } from "./settlement";
import { useInvoices } from "./use-invoices";
import { useMonthData, type MonthData } from "./use-month-data";

export function DashboardScreen() {
  const { api, view } = useWorkspace();
  const [thisMonth] = useState(() => currentMonth());
  const [month, setMonth] = useState(thisMonth);
  const { data, reload } = useMonthData(api, month);
  const invoices = useInvoices(api);
  const { locale } = useLocale();
  const t = dashboardCopy(locale).screen;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{monthLabel(month, locale)}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t.caringFor({ parent: view.workspace.parentName })}</p>
        </div>
        <MonthPicker
          month={month}
          onChange={setMonth}
          max={thisMonth}
          locale={locale}
          label={monthLabel(month, locale)}
        />
      </div>
      <MonthBody data={data} month={month} invoices={invoices} onRetry={reload} locale={locale} />
    </div>
  );
}

interface MonthBodyProps {
  data: MonthData;
  month: string;
  invoices: Invoice[] | null;
  onRetry: () => void;
  locale: Locale;
}

function MonthBody({ data, month, invoices, onRetry, locale }: MonthBodyProps) {
  const { view } = useWorkspace();
  const t = dashboardCopy(locale).screen;
  const monthName = monthLabel(month, locale);
  if (data.state === "loading" || invoices === null) {
    return <LoadingBlock label={t.loading({ month: monthName })} />;
  }
  if (data.state === "error") {
    return (
      <EmptyState
        title={t.errorTitle}
        description={t.errorBody}
        action={<Button onClick={onRetry}>{t.tryAgain}</Button>}
      />
    );
  }
  const entries = data.entries.length;
  const status = settlement(latestInvoice(invoices, month), data.balance);
  if (isEmptyMonth(data.balance)) {
    return (
      <>
        <MonthProgress month={month} entries={entries} invoices={invoices} locale={locale} />
        <EmptyState title={t.emptyTitle({ month: monthName })} description={t.emptyBody} />
      </>
    );
  }
  return (
    <>
      <MonthHeadline
        balance={data.balance}
        month={month}
        entries={entries}
        invoices={invoices}
        settlement={status}
        locale={locale}
      />
      <MonthProgress month={month} entries={entries} invoices={invoices} locale={locale} />
      <MemberBalances balance={data.balance} settlement={status} locale={locale} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <CategoryBreakdown balance={data.balance} locale={locale} />
        <RecentEntries entries={data.entries} members={view.members} locale={locale} />
      </div>
    </>
  );
}
