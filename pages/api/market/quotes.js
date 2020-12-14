import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { symbol } = req.query;

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${symbol}`;
    const apiRes = await axios.get(url);

    const filteredResults = [];
    const results = apiRes?.data?.quoteResponse?.result;
    
    for(let i = 0; i < results.length; i++) {
      const filteredData = Object.keys(results[i])
        .filter(key => fields.includes(key))
        .reduce((obj, key) => {
          obj[key] = results[i][key];
          return obj;
        }, {});
      filteredResults.push(filteredData);
    }
    
    res.json({
      success: true,
      data: filteredResults,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
}

const fields = ['lastPrice', 'closePrice', 'marketState', 'preMarketPrice', 'regularMarketPrice', 'postMarketPrice', 'regularMarketPreviousClose', 'quoteSourceName', 'longName', 'symbol']