// Owner: Nurali. Landing: the family fridge door. Copy in EN / RU / KZ; numbers from the real demo seed.
import type { Metadata } from "next";
import { Pricing, TrustAndClose } from "@/components/landing/Closing";
import { landingCopy } from "@/components/landing/copy";
import { FridgeHero } from "@/components/landing/FridgeHero";
import { landingFontVars } from "@/lib/fonts";
import { Imbalance } from "@/components/landing/Imbalance";
import { landingData } from "@/components/landing/landing-data";
import { Steps } from "@/components/landing/Steps";
import s from "@/components/landing/landing.module.css";
import { getRequestLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = landingCopy(await getRequestLocale());
  return { title: meta.title, description: meta.description };
}

export default async function Home() {
  const locale = await getRequestLocale();
  const copy = landingCopy(locale);
  const data = landingData();
  return (
    <div lang={locale} className={`${s.root} ${landingFontVars} flex flex-1 flex-col`}>
      <main>
        <FridgeHero copy={copy} data={data} locale={locale} />
        <Imbalance copy={copy} data={data} locale={locale} />
        <Steps copy={copy} data={data} locale={locale} />
        <Pricing copy={copy} />
      </main>
      <TrustAndClose copy={copy} />
    </div>
  );
}
