import axios from 'axios';

const MAPPINGS = {
  'HSI': 179,
  'HSI-F': 8984,
  'NQ-F': 8874
}

const MARKET_MAPPINGS = [
  {market: 'HK', symbols: ['HSI', 'HSI-F']},
  {market: 'US', symbols: ['NQ-F']}
]

export default async function handler(req, res) {
  const {market} = req.query;

  try {
    if(!market) {
      return res.json({
        success: false,
      });
    }
    const symbols = MARKET_MAPPINGS.find(m => m.market === market).symbols;
    let results = [];
    for (const symbol of symbols) {
      const url =
        'https://www.investing.com/common/modules/js_instrument_chart/api/data.php';
      const apiRes = await axios.get(url, {
        headers: {
          Referer: 'https://www.investing.com/',
          'X-Requested-With': 'XMLHttpRequest',
        },
        params: {
          pair_id: MAPPINGS[symbol], // 8874: NQ future, 8984: HSI future, 179: HSI
          pair_interval: 86400,
          chart_type: 'candlestick',
          candle_count: 90,
          period: '1-year',
          // volume_series: 'no',
          // events: 'yes'
        },
      });
      if(apiRes?.data) {
        results.push({symbol, data: apiRes?.data});
      }
    }
    // console.log(apiRes?.data);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
}
