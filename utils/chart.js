import moment from 'moment-timezone';
import { convertHexToRGBA } from './index';

const formatDateTime = (timestamp) =>
parseFloat(moment.unix(timestamp).format('x'));

export const parseAreaChartData = (data) => {
  let ohlc = [];
  const dataLength = data ? data?.timestamp?.length : 0;
  if(!dataLength) {
    return { ohlc };
  }
  const closePriceArr = data.indicators.quote[0]['close'];
  let lastValidClosePrice = null;
  for (let i = 0; i < dataLength; i++) {
    lastValidClosePrice = closePriceArr[i] || lastValidClosePrice;
    ohlc.push([
      formatDateTime(data.timestamp[i]), // the date
      closePriceArr[i] || lastValidClosePrice, // close
    ]);
  }
  const lastTradingTime = formatDateTime(data.meta.currentTradingPeriod.regular.end);
  let dummyArray = [];
  for(let i = 0; i < (391 - dataLength); i++) {
    const timestamp = ohlc[dataLength - 1][0] + 60000 * i;
    if(timestamp < lastTradingTime) {
      dummyArray.push([timestamp, null]);
    }
  }
  ohlc = [...ohlc, ...dummyArray];
  return { ohlc };

}

export const getAreaChartOptions = ({ symbol = '', colors = {}, highCharts, data }) => {
  const options = {
    plotOptions: {
      series: {
        lineWidth: 1,
      },
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
        data: data,
        id: symbol,
        threshold: null,
        tooltip: {
          valueDecimals: 2,
          pointFormat: '<strong>{point.y}</strong>',
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
            [1, convertHexToRGBA(colors.primary2, 0.3)],
          ],
        },
      },
    ],
  };
  return options;
};