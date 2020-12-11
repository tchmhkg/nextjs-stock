import { motion } from "framer-motion";

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


export const differenceBetweenValues = ({oldValue, newValue, controls, theme = {}}) =>{  
  const themeTextColor = theme.text;
  const variants = {
    rest: { color: [themeTextColor] },
    up: {color: [themeTextColor, '#4DBD33', themeTextColor], transition: {duration: 1.4}},
    down: {color: [themeTextColor, '#fd1050', themeTextColor], transition: {duration: 1.4}}
  };

  let oldText = oldValue.toString();
  let newText = newValue.toString();
  let text = [];
  let isDiff = false;
  newText.split('').forEach(function(val, i){
    if (val != oldText.charAt(i) || isDiff) {
      isDiff = true;
      text.push(<motion.span
        style={{display: 'inline-block'}}
        variants={variants}
        animate={controls}>{val}</motion.span>);  
    } else {
      text.push(val);
    }
  });
  return text;
}