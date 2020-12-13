import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { ChartSkeleton } from '../ui/chart-skeleton';
import { getCandleStickOptions, parseCandleStickChartData } from '~/utils/chart';
import { CandleStickHighChart } from '~/components/ui/highcharts';

const CandleStickChart = ({ symbol, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});
  const isVisible = usePageVisibility();

  useEffect(() => {
    window.moment = moment;
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
      {!loading ? (
        <CandleStickHighChart
          options={options}
        />
      ) : <ChartSkeleton />}
    </div>
  );
};

export default CandleStickChart;