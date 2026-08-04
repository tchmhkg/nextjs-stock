# nextjs-stock

Market quotes and charts. **Version 2.0.0** rewrite in progress.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Node.js 24.x
- Tailwind CSS 4 · next-intl · next-themes · motion
- `yahoo-finance2` (no API keys) for market data

## Status

PR3 UI shell landed (header, hero, en/zh, theme). Market board features follow.

## Local

```bash
nvm use 24
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en`).

### Routes

- `/en`, `/zh` — home
- `/en/market`, `/zh/market` — market stub
- `/en/market/[symbol]` — symbol stub

### Market APIs

| Endpoint | Query |
|---|---|
| `/api/market/quote` | `symbol` |
| `/api/market/profile` | `symbol` |
| `/api/market/chart` | `symbol`, `interval` (`1m`…`1d`) |
| `/api/market/search` | `q` |
| `/api/market/news` | `symbol` |
| `/api/market/indices` | `region` (`US` \| `HK`) |

```bash
yarn smoke:market
```
