import axios from "axios";
import { TDA_QUOTES_API } from "~/utils/apiUrls";
import { TDA_CLIENT_ID } from "~/utils/config";

export default async function handler(req, res) {

  try {
    const apiResponse = await axios.get(TDA_QUOTES_API, {
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
