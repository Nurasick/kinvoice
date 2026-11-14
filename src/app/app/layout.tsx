// Owner: Yernur. App shell for the caregiver area: the enamel door as a header band.
import { AppNav } from "@/components/layout/AppNav";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { Logo } from "@/components/layout/Logo";
import { WorkspaceProvider } from "@/components/layout/WorkspaceProvider";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="enamel-band sticky top-0 z-20 shadow-[0_10px_24px_-18px_rgb(17_48_127/0.8)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
          <Logo href="/app" tone="enamel" />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <AppNav />
            <LanguageSwitch />
          </div>
        </div>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 outline-none sm:px-8 sm:py-10"
      >
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </main>
    </div>
  );
}
