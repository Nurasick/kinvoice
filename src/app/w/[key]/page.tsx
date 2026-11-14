"use client";
// Owner: Yernur. Edit-link landing: store the key, go to the dashboard.
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveWorkspaceKey } from "@/lib/workspace-key";

export default function EditLinkPage({ params }: PageProps<"/w/[key]">) {
  const { key } = use(params);
  const router = useRouter();
  useEffect(() => {
    saveWorkspaceKey(decodeURIComponent(key));
    router.replace("/app");
  }, [key, router]);
  return <main className="p-8 text-sm">Opening your family workspace…</main>;
}
