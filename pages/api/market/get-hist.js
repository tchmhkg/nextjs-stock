import axios from "axios";

let cancelToken;

export default async function handler(req, res) {
  const { symbol, params = {} } = req.query;
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel("Operation canceled due to new request.");
  }

  cancelToken = axios.CancelToken.source();

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&includePrePost=false&range=3mo`;
  try {
    const apiResponse = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    
    if (apiResponse?.data) {
      res.json({data: apiResponse?.data?.chart?.result?.[0]});
      return;
    }

    res.json({ data: [] });
  } catch (error) {
    console.log(error);
    res.json({ data: [] });
  }
}
