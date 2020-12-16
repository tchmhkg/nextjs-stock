import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { useTheme } from '~/theme';
import { getLineChartOptions, parseLineChartData } from '~/utils/chart';
const LineHighChart = dynamic(import('~/components/ui/highcharts').then(mod => mod.LineHighChart));

const LineChart = ({ symbol, ...props }) => {
  const { colors } = useTheme();
  const chartRef = useRef();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(getLineChartOptions({ symbol, colors }));
  const isVisible = usePageVisibility();

  useEffect(() => {
    fetchStock();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStock();
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, [symbol, isVisible]);

  const fetchStock = async () => {
    try {
      if (!isVisible) {
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
      const { ohlc } = parseLineChartData(res.data?.data);
      setOptions((prevOptions) => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: ohlc }],
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const redrawChart = (chart) => {
    chart.reflow(true);
  }

  return (
    <div>
      {!loading ? (
        <LineHighChart
          ref={chartRef}
          options={options}
          callback={redrawChart}
        />
      ) :  null}
    </div>
  );
};

export default LineChart;
