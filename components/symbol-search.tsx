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

type Props = {
  autoFocus?: boolean;
  onClose?: () => void;
  className?: string;
};

export function SymbolSearch({ autoFocus = false, onClose, className }: Props) {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

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

  const close = () => {
    setQuery("");
    setHits([]);
    setOpen(false);
    onClose?.();
  };

  const go = (symbol: string) => {
    setOpen(false);
    setQuery("");
    onClose?.();
    router.push(`/market/${encodeURIComponent(symbol)}`);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const symbol = query.trim().toUpperCase();
    if (!symbol) return;
    go(symbol);
  };

  return (
    <div ref={wrapRef} className={clsx("relative flex w-full items-center gap-2", className)}>
      {onClose && (
        <button
          type="button"
          onClick={close}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground"
          aria-label={t("searchClose")}
        >
          ←
        </button>
      )}
      <form onSubmit={onSubmit} className="min-w-0 flex-1">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hits.length > 0 && setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className="h-9 w-full rounded-md border border-border bg-surface px-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
      {open && hits.length > 0 && (
        <ul className="absolute top-full right-0 left-0 z-40 mt-1 max-h-[min(16rem,50vh)] overflow-auto rounded-md border border-border bg-surface shadow-lg">
          {hits.map((hit) => (
            <li key={hit.symbol}>
              <button
                type="button"
                onClick={() => go(hit.symbol)}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-accent-soft"
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
