import axios from 'axios';
import { FINNHUB_QUOTE_API } from '~/utils/apiUrls';

// Free Finnhub has no index quotes — liquid ETF proxies keep UI labels.
const ETF_PROXY = {
  HSI: 'EWH',
  'HSI-F': 'EWH',
  $DJI: 'DIA',
  $COMPX: 'QQQ',
  '$SPX.X': 'SPY',
  '/YM': 'DIA',
  '/NQ': 'QQQ',
  '/ES': 'SPY',
};

const MARKET_MAPPINGS = [
  { market: 'HK', symbols: ['HSI', 'HSI-F'] },
  { market: 'US', symbols: ['$DJI', '$COMPX', '$SPX.X', '/YM', '/NQ', '/ES'] },
];

const CACHE_MS = 45000;
const cache = new Map(); // market -> { at, data }

export default async function handler(req, res) {
  const { market } = req.query;

  try {
    if (!market) {
      return res.json({ success: false });
    }
    const mapping = MARKET_MAPPINGS.find((m) => m.market === market);
    if (!mapping) {
      return res.json({ success: false });
    }

    const cached = cache.get(market);
    if (cached && Date.now() - cached.at < CACHE_MS) {
      return res.json({ success: true, data: cached.data });
    }

    // One Finnhub call per unique ETF (US is 3, not 6).
    const uniqueEtfs = [...new Set(mapping.symbols.map((s) => ETF_PROXY[s]))];
    const quotes = {};
    await Promise.all(
      uniqueEtfs.map(async (etf) => {
        try {
          const apiRes = await axios.get(FINNHUB_QUOTE_API, { params: { symbol: etf } });
          quotes[etf] = apiRes?.data || {};
        } catch (err) {
          console.log(etf, err?.message || err);
          quotes[etf] = {};
        }
      })
    );

    const results = mapping.symbols.map((symbol) => {
      const q = quotes[ETF_PROXY[symbol]] || {};
      return {
        symbol,
        lastPrice: q.c ?? 0,
        closePrice: q.pc ?? 0,
      };
    });

    if (results.every((r) => !r.lastPrice)) {
      if (cached?.data) {
        return res.json({ success: true, data: cached.data });
      }
      return res.json({ success: false });
    }

    cache.set(market, { at: Date.now(), data: results });
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log(error?.message || error);
    const cached = cache.get(market);
    if (cached?.data) {
      return res.json({ success: true, data: cached.data });
    }
    res.json({
      success: false,
    });
  }
}
