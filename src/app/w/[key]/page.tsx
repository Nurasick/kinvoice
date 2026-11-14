"use client";
// Owner: Yernur. Edit-link landing: store the key, go to the dashboard.
// The dashboard validates the key; an unknown key shows the calm "no workspace" state there.
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { frameCopy } from "@/components/layout/copy";
import { useLocale } from "@/lib/i18n/client";
import { LoadingBlock } from "@/components/ui";
import { saveWorkspaceKey } from "@/lib/workspace-key";

export default function EditLinkPage({ params }: PageProps<"/w/[key]">) {
  const { key } = use(params);
  const router = useRouter();
  const { locale } = useLocale();
  useEffect(() => {
    saveWorkspaceKey(decodeURIComponent(key));
    router.replace("/app");
  }, [key, router]);
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex-1 px-4">
        <LoadingBlock label={frameCopy(locale).states.openingSpace} />
      </main>
    </div>
  );
}
