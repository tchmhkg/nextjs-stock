import axios from "axios";
import { getDailyPrices, getIntradayPrices } from "~/utils/apiUrls";

const isoDate = (d) => d.toISOString().slice(0, 10);

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDate(d);
};

// Chart parsers still expect Yahoo's chart.result[0] shape.
const toYahooShape = (rows = []) => {
  const timestamp = [];
  const open = [];
  const high = [];
  const low = [];
  const close = [];
  const volume = [];

  for (const row of rows) {
    const t = Math.floor(new Date(row.date).getTime() / 1000);
    if (Number.isNaN(t)) continue;
    timestamp.push(t);
    open.push(row.open ?? null);
    high.push(row.high ?? null);
    low.push(row.low ?? null);
    close.push(row.close ?? null);
    volume.push(row.volume ?? null);
  }

  const end = timestamp[timestamp.length - 1] || Math.floor(Date.now() / 1000);

  return {
    timestamp,
    indicators: {
      quote: [{ open, high, low, close, volume }],
    },
    meta: {
      currentTradingPeriod: {
        regular: { end },
      },
    },
  };
};

export default async function handler(req, res) {
  const { symbol, params } = req.query;

  if (!symbol) {
    return res.json({ data: [] });
  }

  try {
    const parsed = typeof params === "string" ? JSON.parse(params) : params || {};
    const interval = parsed.interval || "1d";
    const isIntraday = interval === "1m" || interval.endsWith("m") || interval.endsWith("h");

    const url = isIntraday
      ? getIntradayPrices(symbol, daysAgo(5))
      : getDailyPrices(symbol, daysAgo(parsed.range === "3mo" ? 100 : 30));

    const apiRes = await axios.get(url);
    const rows = Array.isArray(apiRes?.data) ? apiRes.data : [];
    const data = toYahooShape(rows);

    if (!data.timestamp.length) {
      return res.json({ data: [] });
    }

    res.json({ data });
  } catch (error) {
    console.log(error?.message || error);
    res.status(500).json({ data: [] });
  }
}
