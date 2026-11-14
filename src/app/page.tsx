// Owner: Nurali. Landing: the family fridge door. Copy in EN / RU / KZ; numbers from the real demo seed.
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Pricing, TrustAndClose } from "@/components/landing/Closing";
import { landingCopy } from "@/components/landing/copy";
import { FridgeHero } from "@/components/landing/FridgeHero";
import { landingFontVars } from "@/components/landing/fonts";
import { Imbalance } from "@/components/landing/Imbalance";
import { landingData } from "@/components/landing/landing-data";
import { Steps } from "@/components/landing/Steps";
import s from "@/components/landing/landing.module.css";
import { LOCALE_COOKIE, LOCALE_QUERY, resolveLocale, type Locale } from "@/lib/i18n/locales";

async function currentLocale(searchParams: PageProps<"/">["searchParams"]): Promise<Locale> {
  const [params, jar, h] = await Promise.all([searchParams, cookies(), headers()]);
  return resolveLocale({
    query: params[LOCALE_QUERY],
    cookie: jar.get(LOCALE_COOKIE)?.value,
    acceptLanguage: h.get("accept-language"),
  });
}

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const { meta } = landingCopy(await currentLocale(searchParams));
  return { title: meta.title, description: meta.description };
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const locale = await currentLocale(searchParams);
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
