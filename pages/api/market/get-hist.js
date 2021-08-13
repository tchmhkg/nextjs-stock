import axios from "axios";

const callApi = async (url, params) => {
  try {
    let paramsJson = JSON.parse(params);
    const apiResponse = await axios.get(url, {params: paramsJson});
    
    if (apiResponse?.data) {
      const result = apiResponse?.data?.chart?.result?.[0];
      if(!result?.meta?.validRanges?.includes(paramsJson.range)) {
        const minRange = result?.meta?.validRanges?.[0] || '1d';
        paramsJson.range = minRange;
        if(minRange === '1d') {
          paramsJson.interval = '1m';
        }
        callApi(url, JSON.stringify(paramsJson));
      }
      return result;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function handler(req, res) {
  const { symbol, params } = req.query;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?includePrePost=false`;
  try {
    const data = await callApi(url, params);
    if (data) {
      res.json({data});
      return;
    }

    res.json({ data: [] });
  } catch (error) {
    // console.log(error);
    console.log(error?.response?.status)
    res.status(error?.response?.status || 500).json({ data: [] });
  }
}
