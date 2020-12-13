import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import moment from 'moment-timezone';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '~/theme';
// import { getAreaChartOptions, parseAreaChartData } from '~/utils/chart';
import { convertHexToRGBA } from '~/utils';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

export const AreaHighChart = forwardRef(
  (
    { symbol, data = [], type, callback = () => {}, options, ...props },
    ref
  ) => {
    const { colors } = useTheme();
    options = {
      ...options,
      series: [
        {
          ...options.series[0],
          fillColor: {
            ...options.series[0].fillColor,
            stops: [
              [0, colors.primary1],
              [
                1,
                convertHexToRGBA(colors.primary2, 0.3),
              ],
            ],
          },
        },
      ],
    };
    // console.log('render')
    // const [options, setOptions] = useState(getAreaChartOptions({ symbol, colors, highCharts: Highcharts, data  }));

    // useImperativeHandle(ref, () => ({
    //   updateChart: () => {
    //     console.log('updateChart', data)
    //     const { ohlc } = parseAreaChartData(data);
    //     setOptions((prevOptions) => ({
    //       ...prevOptions,
    //       series: [{ ...prevOptions.series[0], data: ohlc }],
    //     }));
    //   }
    // }))

    // useEffect(() => {
    //   window.moment = moment;
    // }, []);

    // useEffect(() => {
    //   if(type === 'area') {
    //     const { ohlc } = parseAreaChartData(data);
    //     setOptions((prevOptions) => ({
    //       ...prevOptions,
    //       series: [{ ...prevOptions.series[0], data: ohlc }],
    //     }));
    //   }
    // }, [data, type])

    return (
      <HighchartsReact
        ref={ref}
        // allowChartUpdate
        options={options}
        // callback={callback}
        highcharts={Highcharts}
        constructorType="stockChart"
        containerProps={{ className: 'chartContainer' }}
        // oneToOne
      />
    );
  }
);



export const CandleStickHighChart = forwardRef(
  (
    { symbol, options, ...props },
    ref
  ) => {

    return (
      <HighchartsReact
        ref={ref}
        options={options}
        highcharts={Highcharts}
        constructorType="stockChart"
        containerProps={{ className: 'chartContainer' }}
      />
    );
  }
)