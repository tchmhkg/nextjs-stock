/** Client poll interval aligned with delayed Yahoo quotes (not true realtime). */
export function quoteRefreshMs(marketState: string | null | undefined): number {
  switch (marketState) {
    case "REGULAR":
      return 5_000;
    case "PRE":
    case "POST":
      return 10_000;
    default:
      return 60_000;
  }
}

/** Fastest refresh among a batch (e.g. watchlist). */
export function quotesRefreshMs(
  quotes: ReadonlyArray<{ marketState: string | null }> | undefined,
): number {
  if (!quotes?.length) return 60_000;
  return Math.min(...quotes.map((q) => quoteRefreshMs(q.marketState)));
}
