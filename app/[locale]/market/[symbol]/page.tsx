import { SymbolDetail } from "@/components/market/symbol-detail";

type Props = {
  params: Promise<{ locale: string; symbol: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { symbol } = await params;
  return { title: decodeURIComponent(symbol).toUpperCase() };
}

export default async function SymbolPage({ params }: Props) {
  const { symbol } = await params;
  const decoded = decodeURIComponent(symbol).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <SymbolDetail symbol={decoded} />
    </main>
  );
}
