"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";

type Props = {
  symbol: string;
};

export function NewsList({ symbol }: Props) {
  const t = useTranslations("Market");
  const { data, error, isLoading } = useSWR(
    ["news", symbol],
    () => marketApi.news(symbol),
    { revalidateOnFocus: false },
  );

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{t("news")}</h2>
      {error && <p className="mt-2 text-sm text-danger">{t("loadError")}</p>}
      {isLoading && !data && (
        <div className="mt-3 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-surface" />
          ))}
        </div>
      )}
      {data && data.length === 0 && (
        <p className="mt-3 text-sm text-muted">{t("noNews")}</p>
      )}
      {data && data.length > 0 && (
        <ul className="mt-3 divide-y divide-border border-t border-border">
          {data.map((item) => (
            <li key={item.id} className="py-3">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                {item.title}
              </a>
              <p className="mt-1 text-xs text-muted">
                {[item.publisher, formatRelative(item.publishedAt)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatRelative(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
}
