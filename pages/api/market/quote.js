import axios from "axios";
import { FINNHUB_STOCK_PROFILE_API } from "~/utils/apiUrls";

export default async function handler(req, res) {
  const {symbol} = req.query;

  try {
    const profileRes = await axios.get(FINNHUB_STOCK_PROFILE_API, {
      params: {
        symbol,
      }
    });
    res.json({
      success: true,
      profile: profileRes?.data || [],
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      profile: [],
    });
  }
}