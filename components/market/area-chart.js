import { useState, useEffect, useRef, /*useMemo*/ } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
// import useSWR from 'swr';

import { useTheme } from '~/theme';
import { getAreaChartOptions, parseAreaChartData } from '~/utils/chart';
import { usePageVisibility } from '~/hooks/usePageVisibility';

const ChartSkeleton = dynamic(import('~/components/ui/chart-skeleton').then(mod => mod.ChartSkeleton));
const AreaHighChart = dynamic(import('~/components/ui/highcharts').then(mod => mod.AreaHighChart));

// const fetcher = (url, params) => axios.get(url, {params}).then(res => res.data?.data);

const AreaChart = ({ symbol, ...props }) => {
  const { colors } = useTheme();
  const chartRef = useRef(null);
  const isVisible = usePageVisibility();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(getAreaChartOptions({ symbol, colors }));
  // const params = useMemo(() => ({
  //   symbol,
  //   params: JSON.stringify({
  //     interval: '1m',
  //   }),
  // }), [symbol]);

  // const onSuccess = (data) => {
  //   const { ohlc } = parseAreaChartData(data);
  //   if(loading) {
  //     setLoading(false);
  //   }
  //   setOptions((prevOptions) => ({
  //     ...prevOptions,
  //     series: [{ ...prevOptions.series[0], data: ohlc }],
  //   }));
  //   chartRef?.current?.chart?.redraw(true);
  // }

  // const { data, error } = useSWR([symbol ? '/api/market/get-hist' : null, params], fetcher, {onSuccess, refreshInterval: 2500})

  useEffect(() => {
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
    {!loading ? 
      <AreaHighChart
        ref={chartRef}
        options={options}
      /> : <ChartSkeleton />}
    </div>
  );
};

export default AreaChart;
