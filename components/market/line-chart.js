import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { useTheme } from '~/theme';
import { LineHighChart } from '~/components/ui/highcharts';
import { getLineChartOptions, parseLineChartData } from '~/utils/chart';

const LineChart = ({ symbol, ...props }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(getLineChartOptions({ symbol, colors }));
  const isVisible = usePageVisibility();

  useEffect(() => {
    fetchStock();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStock();
    }, 1000 * 60);
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

  return (
    <div>
      {!loading ? (
        <LineHighChart
          options={options}
        />
      ) :  null}
    </div>
  );
};

export default LineChart;
