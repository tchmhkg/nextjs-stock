import axios from "axios";
import { getMetaInfo } from "~/utils/apiUrls";

export default async function handler(req, res) {
  const { symbol } = req.query;

  console.log('GET stock info from symbol => ',symbol);

  const url = getMetaInfo(symbol);
  try {
    const apiResponse = await axios.get(url);
    
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
