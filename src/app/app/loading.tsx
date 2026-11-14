// Owner: Yernur. Shown while an /app page's code loads (the shell header stays in place).
import { frameCopy } from "@/components/layout/copy";
import { LoadingBlock } from "@/components/ui";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function AppLoading() {
  return <LoadingBlock label={frameCopy(await getRequestLocale()).states.loading} />;
}
