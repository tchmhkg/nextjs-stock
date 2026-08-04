"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nextjs-stock:watchlist";

function readWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

function writeWatchlist(symbols: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
}

export function useWatchlist() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSymbols(readWatchlist());
    setReady(true);
  }, []);

  const has = useCallback(
    (symbol: string) => symbols.includes(symbol.toUpperCase()),
    [symbols],
  );

  const toggle = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase();
    setSymbols((prev) => {
      const next = prev.includes(upper)
        ? prev.filter((s) => s !== upper)
        : [...prev, upper];
      writeWatchlist(next);
      return next;
    });
  }, []);

  const remove = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase();
    setSymbols((prev) => {
      const next = prev.filter((s) => s !== upper);
      writeWatchlist(next);
      return next;
    });
  }, []);

  return { symbols, ready, has, toggle, remove };
}
