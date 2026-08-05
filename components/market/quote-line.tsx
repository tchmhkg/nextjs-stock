import { Link } from "@/i18n/navigation";
import {
  changeTone,
  formatPercent,
  formatPrice,
} from "@/lib/market/format";
import type { QuoteDto } from "@/lib/market/types";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = Readonly<{
  quote: QuoteDto;
  href?: string;
  trailing?: ReactNode;
}>;

/** Compact symbol + price + change row (watchlist, movers, etc.). */
export function QuoteLine({ quote, href, trailing }: Props) {
  const tone = changeTone(quote.regularMarketChange);
  const body = (
    <>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-semibold text-foreground">
          {quote.symbol}
        </p>
        <p className="truncate text-xs text-muted">
          {quote.shortName || quote.longName || "…"}
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {formatPrice(quote.regularMarketPrice)}
          {quote.currency ? (
            <span className="ml-1 text-xs font-normal text-muted">
              {quote.currency}
            </span>
          ) : null}
        </p>
        <p className={clsx("font-mono text-xs tabular-nums", tone)}>
          {formatPercent(quote.regularMarketChangePercent)}
        </p>
      </div>
    </>
  );

  return (
    <li className="flex items-center gap-3 px-3 py-3">
      {href ? (
        <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
          {body}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{body}</div>
      )}
      {trailing}
    </li>
  );
}
