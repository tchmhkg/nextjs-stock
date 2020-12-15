import axios from "axios";
let cancelToken;

export default async function handler(req, res) {
  const {symbol} = req.query;

  try {
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }

    cancelToken = axios.CancelToken.source();

    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price`;

    const apiRes = await axios.get(url, {
      cancelToken: cancelToken.token,
    });

    const result = apiRes?.data?.quoteSummary?.result?.[0]?.price || {};
    const filteredData = Object.keys(result)
      .filter(key => fields.includes(key))
      .reduce((obj, key) => {
        obj[key] = result[key];
        return obj;
      }, {});

    res.json({
      success: true,
      data: filteredData
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      data: {}
    });
  }
}

const fields = ['marketState', 'preMarketPrice', 'regularMarketPrice', 'postMarketPrice', 'regularMarketPreviousClose', 'quoteSourceName', 'longName', 'symbol', 'regularMarketDayHigh', 'regularMarketDayLow']