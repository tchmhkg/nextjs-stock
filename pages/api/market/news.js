// import Cors from 'cors'
// import axios from 'axios';
// import initMiddleware from '~/lib/init-middleware'
let Parser = require('rss-parser');
let parser = new Parser();

// Initialize the cors middleware
// const cors = initMiddleware(
//   // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
//   Cors({
//     // Only allow requests with GET, POST and OPTIONS
//     methods: ['GET', 'POST', 'OPTIONS'],
//   })
// )

export default async function handler(req, res) {
  // Run cors
  // await cors(req, res);
  const {symbol} = req.query;

  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`;
  let feed = await parser.parseURL(url);

  res.json({data: feed?.items || []});
}