import axios from "axios";

let cancelToken;

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel("Operation canceled due to new request.");
  }
  //Save the cancel token for the current request
  cancelToken = axios.CancelToken.source();
  const url = `http://d.yimg.com/aq/autoc?query=${symbol}&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks`;
  // console.log(url);
  try {
    const apiResponse = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    if (apiResponse?.data) {
      const results = apiResponse?.data?.replace(
        /(YAHOO\.util\.ScriptNodeDataSource\.callbacks\()(.*)(\);)/g,
        "$2"
      );
      const exchange = ['PNK', 'NYQ', 'NMS', 'NAS', 'NASDAQ', 'NYSE', 'NYSEArca', 'PCX'];
      const parseResults = JSON.parse(results)?.ResultSet?.Result || [];
      res.json({ 
        data: parseResults
          ?.filter(result =>result.typeDisp === 'Equity' || result.typeDisp === 'ETF')
          .filter(result => exchange.includes(result.exch) || exchange.includes(result.exchDisp))
      });
      
      return;
    }

    res.json({ data: [] });
  } catch (error) {
    console.log(error);
    res.json({ data: [] });
  }
}
