import axios from "axios";
import { getLatestPrice } from "~/utils/apiUrls";

let cancelToken;

export default async function handler(req, res) {
  const { symbol } = req.query;
  console.log('GET stock latest price from symbol => ',symbol);
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel("Operation canceled due to new request.");
  }

  cancelToken = axios.CancelToken.source();

  const url = getLatestPrice(symbol);
  try {
    const apiResponse = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    
    if (apiResponse?.data) {
      res.json({data: apiResponse?.data});
      return;
    }

    res.json({ data: [] });
  } catch (error) {
    console.log(error);
    res.json({ data: [] });
  }
}
