import { setRequestLocale, getTranslations } from "next-intl/server";

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
  const t = await getTranslations("Market");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-muted">{t("stub")}</p>
    </main>
  );
}
