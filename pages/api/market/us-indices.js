import axios from 'axios';

export default async function handler(req, res) {
  try {
    const url =
      'https://www.investing.com/common/modules/js_instrument_chart/api/data.php';
    const apiRes = await axios.get(url, {
      headers: {
        Referer: 'https://www.investing.com/',
        'X-Requested-With': 'XMLHttpRequest',
      },
      params: {
        pair_id: 8874, // NQ future
        pair_interval: 86400,
        chart_type: 'candlestick',
        candle_count: 90,
        period: '1-year',
        // volume_series: 'no',
        // events: 'yes'
      },
    });
    // console.log(apiRes?.data);
    res.json({
      success: true,
      data: apiRes?.data?.attr,
      html: apiRes?.data?.html
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
}
