# nextjs-stock

**2.0.0** — live US and Hong Kong market quotes, charts, and news.

A greenfield rewrite of the old Next 10 app: App Router, TypeScript, Node 24, and `yahoo-finance2` (no API keys).

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router) · React 19 · TypeScript |
| Runtime | Node.js **24.x** |
| UI | Tailwind CSS 4 · Geist · motion · light / dark |
| i18n | next-intl — English + 繁體中文 (`/en`, `/zh`) |
| Data | [`yahoo-finance2`](https://www.npmjs.com/package/yahoo-finance2) + Zod + in-memory TTL cache |
| Charts | Lightweight Charts (intraday area · daily candles) |
| Client refresh | SWR |

## Features

- **Market board** — US \| HK region toggle, major indices, US movers (gainers / losers / most active), local watchlist
- **Symbol page** — quote, day range, intraday/daily chart, company summary, news, bookmark
- **Search** — header autocomplete → symbol detail
- **Watchlist** — `localStorage` only (key `nextjs-stock:watchlist`), no auth

## Requirements

- Node.js 24.x (`nvm use 24`)
- Yarn 1.x

No environment variables. Copy `.env.local.example` only if you want a local placeholder file.

## Local

```bash
nvm use 24
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

```bash
yarn build          # production build
yarn smoke:market   # live Yahoo quote + chart sanity check
```

### Routes

| Path | Page |
|---|---|
| `/en`, `/zh` | Home |
| `/en/market`, `/zh/market` | Indices + movers + watchlist |
| `/en/market/[symbol]` | Quote, chart, company, news |

### Market APIs

All handlers live under `app/api/market/*`. Query params are Zod-validated; Yahoo access stays in `server/market/`.

| Endpoint | Query |
|---|---|
| `/api/market/quote` | `symbol` |
| `/api/market/profile` | `symbol` |
| `/api/market/chart` | `symbol`, `lookback` (`1D`…`5Y`), `interval` (`1m`\|`2m`\|`5m`\|`15m`\|`30m`\|`1h`\|`1d`), optional `before` (unix, older page) |
| `/api/market/search` | `q` |
| `/api/market/news` | `symbol` |
| `/api/market/indices` | `region` (`US` \| `HK`) |
| `/api/market/screener` | `list` (`day_gainers` \| `day_losers` \| `most_actives`), optional `count` |
| `/api/market/quotes` | `symbols` (comma-separated, max 20) |

## Deploy (Vercel)

1. Import the repo; framework preset **Next.js**.
2. Set **Node.js Version** to **24.x** (matches `package.json` `engines` and `.nvmrc`).
3. Leave Environment Variables empty — none required.
4. Deploy.

## Yahoo Finance caveats

- `yahoo-finance2` is an unofficial client. Quotes can lag, fail, or change shape without notice.
- Upstream rate-limits and blocks happen. This app uses short TTL caching and conservative SWR intervals; don’t scrape from the browser.
- Intraday (`1m`) is a short lookback so the time axis stays readable (especially for US hours in Asia timezones).

## Migrating from 1.x

2.0 is a **breaking rewrite**, not an in-place upgrade:

| 1.x | 2.0 |
|---|---|
| Pages Router (Next 10) | App Router (Next 16) |
| Finnhub / Tiingo / scrapes | `yahoo-finance2` only |
| API keys in `.env` | None |
| Highcharts · styled-components · PWA · blog | Removed |
| `/market`, `/market/hk`, … | `/[locale]/market` with US\|HK toggle |

Delete old Finnhub/Tiingo env vars from Vercel if they are still set.

## License

Private / personal project unless otherwise noted.
