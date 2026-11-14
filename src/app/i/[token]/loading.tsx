// Owner: Yernur. Shown while the public invoice is fetched on the server.
import { Logo } from "@/components/layout/Logo";
import { LoadingBlock } from "@/components/ui";

export default function PublicInvoiceLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-8">
        <LoadingBlock label="Opening the care update" />
      </main>
    </div>
  );
}
