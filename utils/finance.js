import axios from 'axios';
// import rssParser from 'react-native-rss-parser';
let Parser = require('rss-parser');
let rssParser = new Parser();
let cancelToken;

export const getStock = (opts, type) => {
    const defs = {
      baseURL: 'https://query.yahooapis.com/v1/public/yql?q=',
      query: {
        quotes: 'select * from yahoo.finance.quotes where symbol in ("{stock}")',
        historicaldata: 'select * from yahoo.finance.historicaldata where symbol = "{stock}" and startDate = "{startDate}" and endDate = "{endDate}"',
      },
      suffixURL: {
        quotes: '&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys',
        historicaldata: '&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys',
      },
    };
  
    opts = opts || {};
  
    if (!opts.stock) {
      console.log('No stock defined');
      return;
    }
  
    if (opts.stock instanceof Array) {
      opts.stock = opts.stock.join("', '");
    }
  
    console.log(opts.stock);
  
    const query = defs.query[type]
      .replace('{stock}', opts.stock)
      .replace('{startDate}', opts.startDate)
      .replace('{endDate}', opts.endDate);
  
    const url = defs.baseURL + query + (defs.suffixURL[type] || '');
    console.log(url);
    return fetch(url);  // eslint-disable-line no-undef
  };
  
  export const properties = [
    'AfterHoursChangeRealtime',
    'AnnualizedGain',
    'Ask',
    'AskRealtime',
    'AverageDailyVolume',
    'Bid',
    'BidRealtime',
    'BookValue',
    'Change',
    'ChangeFromFiftydayMovingAverage',
    'ChangeFromTwoHundreddayMovingAverage',
    'ChangeFromYearHigh',
    'ChangeFromYearLow',
    'ChangePercentRealtime',
    'ChangeRealtime',
    'Change_PercentChange',
    'ChangeinPercent',
    'Commission',
    'Currency',
    'DaysHigh',
    'DaysLow',
    'DaysRange',
    'DaysRangeRealtime',
    'DaysValueChange',
    'DaysValueChangeRealtime',
    'DividendPayDate',
    'DividendShare',
    'DividendYield',
    'EBITDA',
    'EPSEstimateCurrentYear',
    'EPSEstimateNextQuarter',
    'EPSEstimateNextYear',
    'EarningsShare',
    'ErrorIndicationreturnedforsymbolchangedinvalid',
    'ExDividendDate',
    'FiftydayMovingAverage',
    'HighLimit',
    'HoldingsGain',
    'HoldingsGainPercent',
    'HoldingsGainPercentRealtime',
    'HoldingsGainRealtime',
    'HoldingsValue',
    'HoldingsValueRealtime',
    'LastTradeDate',
    'LastTradePriceOnly',
    'LastTradeRealtimeWithTime',
    'LastTradeTime',
    'LastTradeWithTime',
    'LowLimit',
    'MarketCapRealtime',
    'MarketCapitalization',
    'MoreInfo',
    'Name',
    'Notes',
    'OneyrTargetPrice',
    'Open',
    'OrderBookRealtime',
    'PEGRatio',
    'PERatio',
    'PERatioRealtime',
    'PercebtChangeFromYearHigh',
    'PercentChange',
    'PercentChangeFromFiftydayMovingAverage',
    'PercentChangeFromTwoHundreddayMovingAverage',
    'PercentChangeFromYearLow',
    'PreviousClose',
    'PriceBook',
    'PriceEPSEstimateCurrentYear',
    'PriceEPSEstimateNextYear',
    'PricePaid',
    'PriceSales',
    'SharesOwned',
    'ShortRatio',
    'StockExchange',
    'Symbol',
    'TickerTrend',
    'TradeDate',
    'TwoHundreddayMovingAverage',
    'Volume',
    'YearHigh',
    'YearLow',
    'YearRange',
  ];
  
  export const getNews = async (symbol) => {
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = axios.CancelToken.source();
    console.log('symbol => ',symbol);
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`;
    console.log(url);
    try {
      const res = await axios.get(url, { 
        cancelToken: cancelToken.token,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
      },
      });
        if(res?.data) {
          console.log(res?.data)
          return [];
          // const news = await rssParser.parse(res.data);
          // return news?.items;
        }
        return [];  // eslint-disable-line no-undef
      } catch (error) {
        console.log(error);
        return [];
    }
  };
  
  const symbolSuggest = async (query) => {
    //Check if there are any previous pending requests
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }

    //Save the cancel token for the current request
    cancelToken = axios.CancelToken.source();
    const url = `http://d.yimg.com/aq/autoc?query=${query}&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks`;
    // console.log(url);
    try {
    const res = await axios.get(url, { cancelToken: cancelToken.token });
      if(res?.data) {
        const results = res?.data?.replace(
                /(YAHOO\.util\.ScriptNodeDataSource\.callbacks\()(.*)(\);)/g,
                '$2',
              );
        return JSON.parse(results)?.ResultSet?.Result;
      }
      return [];  // eslint-disable-line no-undef
    } catch (error) {
      console.log(error);
      return [];
    }
  };