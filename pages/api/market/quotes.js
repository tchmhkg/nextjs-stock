import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { symbol } = req.query;

    const url = `ttps://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${symbol}`;
    const apiRes = await axios.get(url);
    console.log(apiRes?.data);
    res.json({
      success: true,
      data: apiRes?.data?.quoteResponse?.result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
}
