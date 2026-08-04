"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import clsx from "clsx";

type SearchHit = {
  symbol: string;
  shortName: string | null;
  longName: string | null;
};

export function SymbolSearch() {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 1) {
      setHits([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/market/search?q=${encodeURIComponent(query.trim())}`,
        );
        const json = (await res.json()) as {
          success: boolean;
          data?: SearchHit[];
        };
        if (json.success && json.data) {
          setHits(json.data.slice(0, 6));
          setOpen(true);
        }
      } catch {
        setHits([]);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (symbol: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/market/${encodeURIComponent(symbol)}`);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const symbol = query.trim().toUpperCase();
    if (!symbol) return;
    go(symbol);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-xs">
      <form onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hits.length > 0 && setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
      {open && hits.length > 0 && (
        <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-surface shadow-lg">
          {hits.map((hit) => (
            <li key={hit.symbol}>
              <button
                type="button"
                onClick={() => go(hit.symbol)}
                className={clsx(
                  "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-accent-soft",
                )}
              >
                <span className="font-mono text-sm font-semibold text-foreground">
                  {hit.symbol}
                </span>
                <span className="truncate text-xs text-muted">
                  {hit.longName || hit.shortName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
