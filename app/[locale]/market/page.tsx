import { setRequestLocale, getTranslations } from "next-intl/server";
import { MarketBoard } from "@/components/market/market-board";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Market" });
  return { title: t("title") };
}

export default async function MarketPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <MarketBoard />
    </main>
  );
}
