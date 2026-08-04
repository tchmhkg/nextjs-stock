import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; symbol: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { symbol } = await params;
  return { title: decodeURIComponent(symbol).toUpperCase() };
}

export default async function SymbolStubPage({ params }: Props) {
  const { locale, symbol } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Market");
  const decoded = decodeURIComponent(symbol).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <p className="font-mono text-sm text-accent">{decoded}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        {decoded}
      </h1>
      <p className="mt-3 max-w-xl text-muted">{t("stub")}</p>
    </main>
  );
}
