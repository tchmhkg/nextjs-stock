import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});
import React, { Component } from 'react';
// import ReactApexChart from 'react-apexcharts';
import styles from './candlestick-chartV2.module.scss';

// options template
const top100Coins = [];

class CandleStickChart extends Component {
  state = {
    // options template
    top100Coins: [],
    //error message
    errorMsg: '',
    //chart settings
    options: {
      title: {
        text: 'BTC-USDT',
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        labels: {
          formatter: function (y) {
            return '$' + y.toLocaleString('en');
          },
          tooltip: {
            enabled: true,
            y: {
              formatter: function (y) {
                return '$' + y.toLocaleString('en');
              },
            },
          },
        },
      },
    },
    style: {
      background: '#000',
      color: '#777',
      fontSize: '12px',
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    series: [{ data: [{}] }],
  };

  // Fetch Top 100 coins from CoinCap
  // componentWillMount() {
  //   fetch('https://api.coincap.io/v2/assets')
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         const coins = result.data;
  //         coins.forEach((e) => {
  //           //exclude tether
  //           if (e.id != 'tether') {
  //             let newObj = { id: e.id, name: e.name, symbol: e.symbol };
  //             top100Coins.push(newObj);
  //           }
  //         });
  //         let updatedCoins = [...top100Coins]; // copy array to set state in an immutable fashion

  //         this.setState({
  //           top100Coins: updatedCoins,
  //         });
  //       },

  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error,
  //         });
  //       }
  //     );
  // }

  // Default first render (bitcoin)
  // componentDidMount() {
  //   this.setState({
  //     errorMsg: 'Loading...',
  //   });
  //   fetch(
  //     'https://api.coincap.io/v2/candles?exchange=poloniex&interval=d1&baseId=bitcoin&quoteId=tether'
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         let coinData = result.data.slice(-90);

  //         coinData.forEach(function (d) {
  //           d.open = Math.round(d.open * 10000) / 10000;
  //           d.high = Math.round(d.high * 10000) / 10000;
  //           d.low = Math.round(d.low * 10000) / 10000;
  //           d.close = Math.round(d.close * 10000) / 10000;
  //         });

  //         let candlestickFormat = coinData.map(function (d) {
  //           return {
  //             x: new Date(d.period),
  //             y: [d.open, d.high, d.low, d.close],
  //           };
  //         });
  //         console.log(candlestickFormat);
  //         this.setState({
  //           isLoaded: true,
  //           series: [{ data: candlestickFormat }],
  //           errorMsg: '',
  //         });
  //       },

  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error,
  //         });
  //       }
  //     );
  // }

  render() {
    // if(!this.state.series || !this.state.series.length) {
    //   return null;
    // }
    return (
      <div>
        <div id="chart" className={styles.CandleStick}>
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="candlestick"
            height="500"
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default CandleStickChart;
