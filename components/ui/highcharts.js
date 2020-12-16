import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
// import * as Highcharts from 'highcharts/highstock';
import { useTheme } from '~/theme';
import { convertHexToRGBA } from '~/utils';
import { useWindowSize } from '~/hooks/useWindowSize';

const HighchartsReact = dynamic(import('highcharts-react-official'));
const {default: Highcharts} = dynamic(import('highcharts/highstock'));

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

    return (
      <HighchartsReact
        ref={ref}
        options={options}
        highcharts={Highcharts}
        constructorType="stockChart"
        callback={callback}
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
      />
    );
  }
)

export const LineHighChart = forwardRef(
  (
    { symbol, data = [], type, callback = () => {}, options, ...props },
    ref
  ) => {
    const { width: windowWidth } = useWindowSize();
    options = {
      ...options,
      chart: {
        ...options.chart,
        width: windowWidth <= 768 ? 80 : 160
      }
    }

    return (
      <HighchartsReact
        ref={ref}
        options={options}
        highcharts={Highcharts}
        constructorType="stockChart"
      />
    );
  }
);
