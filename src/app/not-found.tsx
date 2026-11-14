// Owner: Yernur. 404 for any unknown URL.
import { Logo } from "@/components/layout/Logo";
import { StatePanel } from "@/components/layout/StatePanel";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col px-4 sm:px-8">
      <header className="mx-auto w-full max-w-5xl py-5">
        <Logo />
      </header>
      <main className="flex-1">
        <StatePanel
          title="We couldn’t find that page"
          body={
            <p>
              The address may be mistyped. If you were opening your family space, use your private link. If a
              sibling sent you an invoice, ask them for the link again.
            </p>
          }
          home={{ href: "/", label: "Go to Kinvoice" }}
        />
      </main>
    </div>
  );
}
