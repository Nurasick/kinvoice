// Owner: Yernur. App shell for the caregiver area.
import { AppNav } from "@/components/layout/AppNav";
import { Logo } from "@/components/layout/Logo";
import { WorkspaceProvider } from "@/components/layout/WorkspaceProvider";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
          <Logo href="/app" />
          <AppNav />
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </div>
    </div>
  );
}
