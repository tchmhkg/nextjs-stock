"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RegionToggle } from "@/components/market/region-toggle";
import { IndicesStrip } from "@/components/market/indices-strip";
import { WatchlistPanel } from "@/components/market/watchlist-panel";
import type { MarketRegion } from "@/lib/market/types";

export function MarketBoard() {
  const t = useTranslations("Market");
  const [region, setRegion] = useState<MarketRegion>("US");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <RegionToggle region={region} onChange={setRegion} />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          {t("indices")}
        </h2>
        <IndicesStrip region={region} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          {t("watchlist")}
        </h2>
        <WatchlistPanel />
      </section>
    </div>
  );
}
