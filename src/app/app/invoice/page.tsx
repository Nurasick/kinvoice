// Owner: Yernur. Invoice composer: tone → AI draft → edit → publish → share link; past invoices.
import { InvoiceScreen } from "@/components/invoice/InvoiceScreen";
import { IsoMonth } from "@/shared/domain";

export default async function InvoicePage({ searchParams }: PageProps<"/app/invoice">) {
  const { month } = await searchParams;
  const parsed = IsoMonth.safeParse(month);
  return <InvoiceScreen initialMonth={parsed.success ? parsed.data : undefined} />;
}
