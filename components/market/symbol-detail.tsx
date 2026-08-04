"use client";

import { QuoteHeader } from "@/components/market/quote-header";
import { BookmarkButton } from "@/components/market/bookmark-button";
import { PriceChart } from "@/components/market/price-chart";
import { CompanyProfile } from "@/components/market/company-profile";
import { NewsList } from "@/components/market/news-list";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  symbol: string;
}>;

export function SymbolDetail({ symbol }: Props) {
  const t = useTranslations("Market");

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/market"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          ← {t("backToMarket")}
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <QuoteHeader symbol={symbol} />
          <BookmarkButton symbol={symbol} />
        </div>
      </div>

      <PriceChart symbol={symbol} />
      <CompanyProfile symbol={symbol} />
      <NewsList symbol={symbol} />
    </div>
  );
}
