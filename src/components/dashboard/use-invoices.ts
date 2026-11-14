"use client";
import { useEffect, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import type { Invoice } from "@/shared/domain";

/**
 * Published invoices, loaded once for the dashboard (the headline and the progress strip share them).
 * null while loading; a failed load counts as "no invoices" so the dashboard never breaks over it.
 */
export function useInvoices(api: WorkspaceApi): Invoice[] | null {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  useEffect(() => {
    let current = true;
    api
      .listInvoices()
      .then((list) => current && setInvoices(list))
      .catch(() => current && setInvoices([]));
    return () => {
      current = false;
    };
  }, [api]);
  return invoices;
}
