import Cors from "cors";
import axios from "axios";
import initMiddleware from "~/lib/init-middleware";

let cancelToken;

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  // Run cors
  await cors(req, res);
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
      const parseResults = JSON.parse(results)?.ResultSet?.Result || [];
      res.json({ data: parseResults?.filter(
        (result) =>
          result.typeDisp === 'Equity' || result.typeDisp === 'ETF',
      )});
      
      return;
    }

    res.json({ data: [] });
  } catch (error) {
    console.log(error);
    res.json({ data: [] });
  }
}
