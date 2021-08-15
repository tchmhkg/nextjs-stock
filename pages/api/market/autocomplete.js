import axios from "axios";
import { TIINGO_SEARCH_API } from "~/utils/apiUrls";

export default async function handler(req, res) {
  const {symbol} = req.query;

  try {
    const response = await axios.get(TIINGO_SEARCH_API, {
      params: {
        query: symbol,
        columns: 'ticker,name,assetType,countryCode'
      }
    });
    res.json({
      success: true,
      result: response?.data?.filter(ticker => (ticker.assetType === 'Stock' || ticker.assetType === 'ETF') && ticker.countryCode === 'US')
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
}