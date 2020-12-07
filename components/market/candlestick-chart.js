import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import _ from 'lodash';
import Highcharts from 'highcharts/highstock'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import useTranslation from '~/hooks/useTranslation';
// import { useTheme } from '~/theme';
// import { chartDarkTheme } from '~/theme/dark';
// import { chartLightTheme } from '~/theme/light';

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

const formatDateTime = timestamp => parseFloat(moment.unix(timestamp).format('x'))

function parseData(data) {
  let ohlc = [];
  let volume = [];
    for (let i = 0; i < data.timestamp.length; i += 1) {
      ohlc.push([
        formatDateTime(data.timestamp[i]), // the date
        data.indicators.quote[0]['open'][i], // open
        data.indicators.quote[0]['high'][i], // high
        data.indicators.quote[0]['low'][i], // low
        data.indicators.quote[0]['close'][i] // close
      ]);

      volume.push([
        formatDateTime(data.timestamp[i]), // the date
        data.indicators.quote[0]['volume'][i] // the volume
      ]);
    }
  return {ohlc, volume}
}

const CandleStickChart = ({symbol, ...props}) => {
  const {t} = useTranslation();
  // const {mode} = useTheme();
    // const [data, setData] = useState([]);
    // const [vData, setVData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState({});

    useEffect(() => {
      window.moment = moment;
      fetchStock();
    }, [symbol])

    // useEffect(() => {
    //   Highcharts.theme = mode === 'dark' ? chartDarkTheme : chartLightTheme;
    //   Highcharts.setOptions(Highcharts.theme)
    // }, [mode])

    const fetchStock = async () => {
        try {
          if (!symbol) {
            return;
          }
          // setLoading(true);
          const res = await axios.get('/api/market/get-hist', {
            params: {
              symbol,
            },
          });

          // console.log('res => ',res?.data);

          const { ohlc, volume } = parseData(res.data?.data);
          setOptions(getOptions({symbol, ohlc, volume}))
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
    
    return (
      <div>
        <h3>{t('Chart')}</h3>
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
}

export default CandleStickChart;
const getOptions = ({symbol = '', ohlc = [], volume = []}) => {
// console.log(ohlc)
  const options = {
    exporting: {
      enabled: false
    },
    time: {
      timezone: 'America/New_York',
    },
    rangeSelector: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    yAxis: [
      {
        labels: {
          align: 'left',
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'left',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    series: [
      {
        type: 'candlestick',
        name: symbol,
        data: ohlc,
        id: symbol,
        tooltip: { valueDecimals: 2 },
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

}