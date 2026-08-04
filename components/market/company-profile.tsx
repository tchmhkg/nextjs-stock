"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";

type Props = Readonly<{
  symbol: string;
}>;

export function CompanyProfile({ symbol }: Props) {
  const t = useTranslations("Market");
  const { data, error, isLoading } = useSWR(
    ["profile", symbol],
    () => marketApi.profile(symbol),
    { revalidateOnFocus: false },
  );

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{t("company")}</h2>
      {error && <p className="mt-2 text-sm text-danger">{t("loadError")}</p>}
      {isLoading && !data && (
        <div className="mt-3 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-surface" />
          ))}
        </div>
      )}
      {data && (
        <div className="mt-3 space-y-3">
          {(data.sector || data.industry) && (
            <p className="text-sm text-muted">
              {[data.sector, data.industry].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="max-h-40 overflow-y-auto text-sm leading-relaxed text-foreground">
            {data.summary || t("noSummary")}
          </p>
        </div>
      )}
    </section>
  );
}
