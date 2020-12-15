let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const {symbol} = req.query;

  try {
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`;
    let feed = await parser.parseURL(url);

    res.json({
      success: true,
      feeds: feed?.items || [],
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      feeds: [],
    });
  }
}