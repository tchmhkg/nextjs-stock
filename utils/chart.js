import { fromUnixTime, format } from "date-fns";
import { convertHexToRGBA } from './index';

const formatDateTime = (timestamp) =>
parseFloat(format(fromUnixTime(timestamp), 'T'));

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
    credits: {
        enabled: false
    },
    lang: {
      decimalPoint: '.',
      thousandsSeparator: ',',
    },
    chart: {
      backgroundColor: 'transparent',
      height: 300,
      panning: false,
      pinchType: null,
    },
    exporting: {
      enabled: false,
    },
    time: {
      // timezone: 'America/New_York',
      timezoneOffset: 60 * 5,
      // useUTC: true,
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

export const parseCandleStickChartData = (data) => {
  let ohlc = [];
  let volume = [];

  const dataLength = data ? data?.timestamp?.length : 0;

  if(!dataLength) {
    return { ohlc, volume };
  }

  for (let i = 0; i < dataLength; i ++) {
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

export const getCandleStickOptions = ({ symbol = '', ohlc = [], volume = [] }) => {
  const options = {
    lang: {
      decimalPoint: '.',
      thousandsSeparator: ','
    },
    credits: {
        enabled: false
    },
    chart: {
      backgroundColor: 'transparent',
      height: 300
    },
    plotOptions: {
      candlestick: {
        color: '#fd1050',
        lineColor: '#fd1050',
        upColor: '#0cce6b',
        upLineColor: '#0cce6b',
      },
      column: {
        color: '#b2b2b2',
      },
    },
    exporting: {
      enabled: false,
    },
    time: {
      // timezone: 'America/New_York',
      timezoneOffset: 60 * 5,
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
      min: ohlc?.[ohlc.length - 28]?.[0],
      max: ohlc?.[ohlc.length - 1]?.[0],
      labels: {
        formatter: function() {
          return format(this.value, 'yyyy/MM');
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
        gridLineWidth: 1,
        // labels: {
          // enabled: false
        // },
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
        zIndex: 1,
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


export const parseLineChartData = (data) => {
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
  return { ohlc };
}

export const getLineChartOptions = ({ symbol = '', colors = {}, data }) => {
  const options = {
    plotOptions: {
      series: {
        lineWidth: 1,
      },
    },
    credits: {
        enabled: false
    },
    lang: {
      decimalPoint: '.',
      thousandsSeparator: ',',
    },
    chart: {
      backgroundColor: 'transparent',
      height: 50,
      width: 80,
      panning: false,
      pinchType: null,
      spacing: [0,3,0,3]
    },
    exporting: {
      enabled: false,
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
      visible: false
    },
    yAxis: {
      visible: false
    },
    tooltip: {
      enabled: false
    },

    series: [
      {
        name: symbol,
        data: data,
        id: symbol,
        states: {
          hover: {
              enabled: false
          },
          enableMouseTracking: false,
          market: {
            enabled: false
          }
        },
        color: {
          linearGradient: {
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0,
          },
          stops: [
            [0, colors.primary2],
            [1, colors.primary1]
          ]
        }
      },
    ],
  };
  return options;
};