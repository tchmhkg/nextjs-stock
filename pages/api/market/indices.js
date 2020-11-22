import axios from "axios";
import { TDA_QUOTES_API } from "~/utils/apiUrls";
import { TDA_CLIENT_ID } from "~/utils/config";

let cancelToken;

export default async function handler(req, res) {
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel("Operation canceled due to new request.");
  }

  cancelToken = axios.CancelToken.source();

  try {
    const apiResponse = await axios.get(TDA_QUOTES_API, {
      cancelToken: cancelToken.token,
      params: {
        apikey: TDA_CLIENT_ID,
        symbol: "$DJI,$COMPX,$SPX.X,/YM,/NQ,/ES",
      },
    });
    
    if (apiResponse?.data) {
      res.json({data: apiResponse?.data});
      return;
    }

    res.json({ data: [] });
  } catch (error) {
    console.log(error);
    res.json({ data: [], error });
  }
}
