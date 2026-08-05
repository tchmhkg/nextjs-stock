"use client";

import { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";

type Props = Readonly<{
  symbol: string;
}>;

/** ~4 lines at text-sm / leading-relaxed. */
const COLLAPSED_CHARS = 280;

export function CompanyProfile({ symbol }: Props) {
  const t = useTranslations("Market");
  const [expanded, setExpanded] = useState(false);
  const { data, error, isLoading } = useSWR(
    ["profile", symbol],
    () => marketApi.profile(symbol),
    { revalidateOnFocus: false },
  );

  const summary = data?.summary?.trim() || null;
  const long = summary != null && summary.length > COLLAPSED_CHARS;
  const shown =
    summary && long && !expanded
      ? `${summary.slice(0, COLLAPSED_CHARS).trimEnd()}…`
      : summary;

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{t("company")}</h2>
      {error && <p className="mt-2 text-sm text-danger">{t("loadError")}</p>}
      {isLoading && !data && (
        <div className="mt-3 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-surface" />
          ))}
        </div>
      )}
      {data && (
        <div className="mt-3 space-y-2">
          {(data.sector || data.industry) && (
            <p className="text-sm text-muted">
              {[data.sector, data.industry].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="text-sm leading-relaxed text-foreground">
            {shown || t("noSummary")}
          </p>
          {long ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-medium text-accent transition-colors hover:text-foreground"
            >
              {expanded ? t("showLess") : t("showMore")}
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}
