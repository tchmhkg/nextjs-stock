import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import useTranslation from '~/hooks/useTranslation';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { useTheme } from '~/theme';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const formatDateTime = (timestamp) =>
  parseFloat(moment.unix(timestamp).format('x'));

function parseData(data) {
  let ohlc = [];
  const dataLength = data.timestamp.length;
  for (let i = 0; i < dataLength; i += 1) {
    ohlc.push([
      formatDateTime(data.timestamp[i]), // the date
      data.indicators.quote[0]['close'][i], // close
    ]);
  }

  const dummyArray = Array(391 - dataLength)
    .fill()
    .map((_, i) => [ohlc[dataLength - 1][0] + 60000 * i, null]);
  ohlc = [...ohlc, ...dummyArray];

  return { ohlc };
}

const AreaChart = ({ symbol, ...props }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(getOptions({ symbol, colors }));
  const isVisible = usePageVisibility();

  useEffect(() => {
    window.moment = moment;
    fetchStock();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStock();
    }, 2000);
    return () => clearInterval(interval);
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
            interval: '1m',
          }),
        },
      });

      const { ohlc } = parseData(res.data?.data);
      setOptions(prevOptions => ({ ...prevOptions, series: [{ ...prevOptions.series[0], data: ohlc }] }));
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

export default AreaChart;

const getOptions = ({ symbol = '', colors = {} }) => {
  const options = {
    plotOptions: {
      series: {
          lineWidth: 1
      }
    },
    lang: {
      decimalPoint: '.',
      thousandsSeparator: ',',
    },
    chart: {
      backgroundColor: 'transparent',
      height: 300,
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
      lineWidth: 0,
    },
    yAxis: [
      {
        lineWidth: 0,
        opposite: false,
        offset: 0,
        tickPosition: 'inside',
        zoomEnabled: false,
        crosshair: true,
        gridLineWidth: 0.5,
        gridLineColor: '#9f9f9f',
      },
    ],
    tooltip: {
      split: true,
      borderColor: 'black',
      borderWidth: 0,
    },

    series: [
      {
        type: 'area',
        name: symbol,
        data: [],
        id: symbol,
        threshold: null,
        tooltip: {
          valueDecimals: 2,
          pointFormat:
            '<strong>{point.y}</strong>'
        },
        lineColor: colors.primary1,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, colors.primary1],
            [
              1,
              Highcharts.color(colors.primary2)
                .setOpacity(0.3)
                .get('rgba'),
            ],
          ],
        },
      },
    ],
  };
  return options;
};
