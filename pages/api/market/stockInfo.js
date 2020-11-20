import axios from "axios";
import { getMetaInfo, getLatestPrice } from "~/utils/apiUrls";
let Parser = require('rss-parser');
let parser = new Parser();
let cancelToken;

export default async function handler(req, res) {
  const {symbol} = req.query;

  try {
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`;
    let feed = await parser.parseURL(url);

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }

    cancelToken = axios.CancelToken.source();

    const latestPriceRes = await axios.get(getLatestPrice(symbol), {
      cancelToken: cancelToken.token,
    });

    const metaInfoRes = await axios.get(getMetaInfo(symbol), {
      cancelToken: cancelToken.token,
    });

    res.json({
      success: true,
      feeds: feed?.items || [],
      latestPrice: latestPriceRes?.data || [],
      metaInfo: metaInfoRes?.data || []
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      feeds: [],
      latestPrice: [],
      metaInfo: []
    });
  }
}