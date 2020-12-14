import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { useTheme } from '~/theme';
import { ChartSkeleton } from '~/components/ui/chart-skeleton';
import { AreaHighChart } from '~/components/ui/highcharts';
import { getAreaChartOptions, parseAreaChartData } from '~/utils/chart';

const AreaChart = ({ symbol, ...props }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(getAreaChartOptions({ symbol, colors }));
  const isVisible = usePageVisibility();

  useEffect(() => {
    window.moment = moment;
    fetchStock();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStock();
    }, 5000);
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
      const { ohlc } = parseAreaChartData(res.data?.data);
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
        <AreaHighChart
          options={options}
        />
      ) : <ChartSkeleton />}
    </div>
  );
};

export default AreaChart;
