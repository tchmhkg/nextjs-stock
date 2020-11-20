import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

function parseData(data) {
    const newData = data?.map(d => {
        d.date = moment(d.date).format('YYYY-MM-DD');
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        // d.volume = +d.volume;
    
        return d;
    });
    console.log('parseData',newData);
    return newData;
}

const CandleStickChart = ({symbol, ...props}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStock();
    }, [symbol])

    const fetchStock = async () => {
        try {
          if (!symbol) {
            return;
          }
          // setLoading(true);
          // const res = await axios.get('/api/market/getStockPrices', {
          //   params: {
          //       symbol
          //   },
          // });

          // console.log('res => ',res?.data);
          // parseData(res.data?.data);
          // setData(res.data);
          // setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
    
    return (
        <div>
            CandleStickChart
        </div>
    )
}

export default CandleStickChart;