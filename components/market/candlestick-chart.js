import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import useTranslation from '~/hooks/useTranslation';
import { usePageVisibility } from '~/hooks/usePageVisibility';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const formatDateTime = (timestamp) =>
  parseFloat(moment.unix(timestamp).format('x'));

function parseData(data) {
  let ohlc = [];
  let volume = [];
  for (let i = 0; i < data.timestamp.length; i += 1) {
    ohlc.push([
      formatDateTime(data.timestamp[i]), // the date
      data.indicators.quote[0]['open'][i], // open
      data.indicators.quote[0]['high'][i], // high
      data.indicators.quote[0]['low'][i], // low
      data.indicators.quote[0]['close'][i], // close
    ]);

    volume.push([
      formatDateTime(data.timestamp[i]), // the date
      data.indicators.quote[0]['volume'][i], // the volume
    ]);
  }
  return { ohlc, volume };
}

const CandleStickChart = ({ symbol, ...props }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});
  const isVisible = usePageVisibility();

  useEffect(() => {
    window.moment = moment;
    fetchStock();
  }, [symbol, isVisible]);

  const fetchStock = async () => {
    try {
      if (!isVisible) {
        console.log('page not visible, quit');
        return;
      }
      if (!symbol) {
        return;
      }
      // setLoading(true);
      const res = await axios.get('/api/market/get-hist', {
        params: {
          symbol,
          params: JSON.stringify({
            range: 'max',
            interval: '1d',
          })
        },
      });

      // console.log('res => ',res?.data);

      const { ohlc, volume } = parseData(res.data?.data);
      setOptions(getOptions({ symbol, ohlc, volume }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {!loading && (
        <HighchartsReact
          options={options}
          highcharts={Highcharts}
          constructorType="stockChart"
          containerProps={{ className: 'chartContainer' }}
        />
      )}
    </div>
  );
};

export default CandleStickChart;
const getOptions = ({ symbol = '', ohlc = [], volume = [] }) => {
  // console.log(ohlc)
  const options = {
    lang: {
      decimalPoint: '.',
      thousandsSeparator: ','
    },
    chart: {
      backgroundColor: 'transparent',
      height: 300
    },
    plotOptions: {
      candlestick: {
        color: '#fd1050',
        lineColor: '#fd1050',
        upColor: '#4DBD33',
        upLineColor: '#4DBD33',
      },
      column: {
        color: 'gray',
      },
    },
    exporting: {
      enabled: false,
    },
    time: {
      timezone: 'America/New_York',
    },
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    xAxis: {
      min: ohlc[ohlc.length - 28][0],
      max: ohlc[ohlc.length - 1][0],
      labels: {
        formatter: function() {
          return moment(this.value).format('YYYY/MM');
        }
      },
      tickInterval: 24 * 3600 * 1000 * 30.5,
      lineWidth: 0,
    },
    yAxis: [
      {
        height: '70%',
        lineWidth: 0,
        opposite:false,
        offset: 0,
        tickAmount: 8,
        tickPosition: 'inside',
        zoomEnabled: false,
        crosshair: true,
        gridLineWidth: 0.5,
        gridLineColor: '#9f9f9f'
      },
      {
        top: '75%',
        height: '25%',
        offset: 0,
        lineWidth: 0,
        opposite:false,
        tickAmount: 4,
        tickPosition: 'inside',
        zoomEnabled: false,
        gridLineWidth: 0.5,
        gridLineColor: '#9f9f9f'
      },
    ],
    tooltip: {
      split: true,
      borderColor: 'black',
      borderWidth: 0,
      followTouchMove: false,
    },

    series: [
      {
        type: 'candlestick',
        name: symbol,
        data: ohlc,
        id: symbol,
        panning: true,
        pinchType: 'x',
        tooltip: {
          valueDecimals: 2,
          pointFormat:
            'Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>',
        },
        zoomType: null,
      },
      {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
      },
    ],
  };
  return options;
};
