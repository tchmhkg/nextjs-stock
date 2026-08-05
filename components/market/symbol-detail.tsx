"use client";

import { QuoteHeader } from "@/components/market/quote-header";
import { PriceChart } from "@/components/market/price-chart";
import { CompanyProfile } from "@/components/market/company-profile";
import { SymbolInsights } from "@/components/market/symbol-insights";
import { NewsList } from "@/components/market/news-list";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  symbol: string;
}>;

export function SymbolDetail({ symbol }: Props) {
  const t = useTranslations("Market");

  return (
    <div>
      <Link
        href="/market"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← {t("backToMarket")}
      </Link>
      <div className="mt-4">
        <QuoteHeader symbol={symbol}>
          <PriceChart symbol={symbol} />
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            <div className="min-w-0 flex-1">
              <CompanyProfile symbol={symbol} />
            </div>
            <div className="min-w-0 flex-1 empty:hidden">
              <SymbolInsights symbol={symbol} />
            </div>
          </div>
          <NewsList symbol={symbol} />
        </QuoteHeader>
      </div>
    </div>
  );
}
