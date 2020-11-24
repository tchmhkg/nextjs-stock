import axios from "axios";
import { FINNHUB_STOCK_PROFILE_API, FINNHUB_QUOTE_API } from "~/utils/apiUrls";

export default async function handler(req, res) {
  const {symbol} = req.query;

  try {
    const quoteRes = await axios.get(FINNHUB_QUOTE_API, {
      params: {
        symbol,
      },
    });

    const profileRes = await axios.get(FINNHUB_STOCK_PROFILE_API, {
      params: {
        symbol,
      }
    });
    res.json({
      success: true,
      quote: quoteRes?.data || [],
      profile: profileRes?.data || [],
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      quote: [],
      profile: [],
    });
  }
}