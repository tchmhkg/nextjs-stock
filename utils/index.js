export const dollarFormat = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
      return false;
    }
};

export const getLastAndClosePriceFromYahoo = item => {
  let lastPrice = 0;
  let closePrice = 0;
  if(!item) {
    return {lastPrice, closePrice};
  }
  const { marketState } = item;
  if(marketState === 'PRE') {
    lastPrice = item?.preMarketPrice || item?.regularMarketPrice;
    closePrice = item?.regularMarketPrice;
  } else if (['POSTPOST', 'PREPRE', 'PREPARE'].includes(marketState)) {
    lastPrice = item?.postMarketPrice;
    closePrice = item?.regularMarketPrice;
  } else if (marketState === 'CLOSED') {
    lastPrice = item?.postMarketPrice;
    closePrice = item?.regularMarketPreviousClose;
  } else {
    lastPrice = item?.regularMarketPrice;
    closePrice = item?.regularMarketPreviousClose;
  }
  return {lastPrice, closePrice};
}