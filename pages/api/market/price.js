import axios from "axios";
import { FINNHUB_QUOTE_API, FINNHUB_STOCK_PROFILE_API } from "~/utils/apiUrls";

const raw = (value) => ({ raw: value ?? 0, fmt: value != null ? String(value) : "0" });

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ success: false, data: {} });
  }

  try {
    const [quoteRes, profileRes] = await Promise.all([
      axios.get(FINNHUB_QUOTE_API, { params: { symbol } }),
      axios.get(FINNHUB_STOCK_PROFILE_API, { params: { symbol } }),
    ]);

    const q = quoteRes?.data || {};
    const profile = profileRes?.data || {};

    if (q.c == null || q.c === 0) {
      return res.status(500).json({ success: false, data: {} });
    }

    // Always REGULAR: Finnhub free has no session; avoids PRE/POST/CLOSED paths reading empty fields.
    res.json({
      success: true,
      data: {
        marketState: "REGULAR",
        regularMarketPrice: raw(q.c),
        regularMarketPreviousClose: raw(q.pc),
        quoteSourceName: "Finnhub",
        longName: profile.name || symbol,
        symbol,
        regularMarketDayHigh: raw(q.h),
        regularMarketDayLow: raw(q.l),
      },
    });
  } catch (error) {
    console.log(error?.message || error);
    res.status(500).json({
      success: false,
      data: {},
    });
  }
}
