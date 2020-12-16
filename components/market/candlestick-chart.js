import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { getCandleStickOptions, parseCandleStickChartData } from '~/utils/chart';

const ChartSkeleton = dynamic(import('~/components/ui/chart-skeleton').then(mod => mod.ChartSkeleton));
const CandleStickHighChart = dynamic(import('~/components/ui/highcharts').then(mod => mod.CandleStickHighChart));

const CandleStickChart = ({ symbol, ...props }) => {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const isVisible = usePageVisibility();

  useEffect(() => {
    fetchStock();
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
            range: '3mo',
            interval: '1d',
          })
        },
      });

      const { ohlc, volume } = parseCandleStickChartData(res.data?.data);
      setOptions(getCandleStickOptions({ symbol, ohlc, volume }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
    {!loading ? 
      <CandleStickHighChart
        options={options}
      /> : <ChartSkeleton />}
    </div>
  );
};

export default CandleStickChart;