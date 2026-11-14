"use client";
/** Invoice composer + past invoices. Owner: Yernur. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { currentMonth } from "@/components/dashboard/dashboard-view";
import { useMonthData } from "@/components/dashboard/use-month-data";
import { monthLabel } from "@/components/log/labels";
import type { Invoice } from "@/shared/domain";
import { Button, EmptyState, LoadingBlock, MonthPicker, buttonClass } from "@/components/ui";
import { ComposerCard } from "./ComposerCard";
import { InvoiceList } from "./InvoiceList";
import { publishedLabel, sortInvoices } from "./invoice-view";
import { PublishedPanel } from "./PublishedPanel";
import { useComposer } from "./use-composer";

export function InvoiceScreen({ initialMonth }: { initialMonth?: string }) {
  const { api } = useWorkspace();
  const [thisMonth] = useState(() => currentMonth());
  const [month, setMonth] = useState(() =>
    initialMonth && initialMonth <= thisMonth ? initialMonth : thisMonth,
  );
  const { data, reload } = useMonthData(api, month);
  const invoices = useInvoices();
  const hasCosts = data.state === "ready" && data.balance.totalOutOfPocketCents > 0;
  const composer = useComposer(api, month, hasCosts, invoices.reload);
  const sentForMonth =
    invoices.state === "ready" ? invoices.list.find((inv) => inv.month === month) : undefined;

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="compose" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="compose" className="font-display text-3xl font-medium sm:text-4xl">
              Care invoice
            </h1>
            <p className="mt-1 text-ink-muted">One calm update your siblings can open without an account.</p>
          </div>
          <MonthPicker month={month} onChange={setMonth} max={thisMonth} />
        </div>
        {data.state === "loading" && <LoadingBlock label={`Loading ${monthLabel(month)}`} />}
        {data.state === "error" && (
          <EmptyState
            title="We couldn't load this month"
            description="Your data is safe. This is usually a brief connection hiccup."
            action={<Button onClick={reload}>Try again</Button>}
          />
        )}
        {data.state === "ready" && !hasCosts && (
          <EmptyState
            title={`No care costs logged for ${monthLabel(month)}`}
            description="An invoice shares out-of-pocket costs, so log at least one expense first."
            action={
              <Link href="/app/log" className={buttonClass("primary")}>
                Log care
              </Link>
            }
          />
        )}
        {data.state === "ready" && hasCosts && composer.published && (
          <PublishedPanel
            invoice={composer.published}
            monthName={monthLabel(month)}
            onStartOver={composer.startOver}
          />
        )}
        {data.state === "ready" && hasCosts && !composer.published && (
          <ComposerCard
            composer={composer}
            balance={data.balance}
            alreadySentOn={sentForMonth ? publishedLabel(sentForMonth.publishedAt) : undefined}
          />
        )}
      </section>

      <section aria-labelledby="sent" className="flex flex-col gap-4">
        <h2 id="sent" className="font-display text-2xl font-medium">
          Sent invoices
        </h2>
        {invoices.state === "loading" && <LoadingBlock label="Loading invoices" />}
        {invoices.state === "error" && (
          <EmptyState
            title="We couldn't load your invoices"
            action={<Button onClick={invoices.reload}>Try again</Button>}
          />
        )}
        {invoices.state === "ready" && (
          <InvoiceList api={api} invoices={invoices.list} onChanged={invoices.reload} />
        )}
      </section>
    </div>
  );
}

type InvoicesState = { state: "loading" } | { state: "error" } | { state: "ready"; list: Invoice[] };

function useInvoices(): InvoicesState & { reload: () => void } {
  const { api } = useWorkspace();
  const [state, setState] = useState<InvoicesState>({ state: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    api
      .listInvoices()
      .then((list) => current && setState({ state: "ready", list: sortInvoices(list) }))
      .catch(() => current && setState({ state: "error" }));
    return () => {
      current = false;
    };
  }, [api, attempt]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
