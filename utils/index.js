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

export const getPricesFromYahoo = item => {
  let lastPrice = 0;
  let closePrice = 0;
  if(!item) {
    return {lastPrice, closePrice};
  }
  const { marketState } = item;
  if(marketState === 'PRE') {
    lastPrice = item?.preMarketPrice.raw || item?.regularMarketPrice.raw;
    closePrice = item?.regularMarketPrice.raw;
  } else if (['POSTPOST', 'PREPRE', 'PREPARE'].includes(marketState)) {
    lastPrice = item?.postMarketPrice.raw;
    closePrice = item?.regularMarketPrice.raw;
  } else if (marketState === 'CLOSED') {
    lastPrice = item?.postMarketPrice.raw;
    closePrice = item?.regularMarketPreviousClose.raw;
  } else {
    lastPrice = item?.regularMarketPrice.raw;
    closePrice = item?.regularMarketPreviousClose.raw;
  }
  return {lastPrice, closePrice};
}

const spanStyle = {display: 'inline-block'};

export const differenceBetweenValues = ({oldValue = 0, newValue = 0, controls, theme = {}}) =>{  
  const themeTextColor = theme.text;
  const variants = {
    rest: { color: [themeTextColor] },
    up: {color: [themeTextColor, '#0cce6b', themeTextColor], transition: {duration: 1.4}},
    down: {color: [themeTextColor, '#fd1050', themeTextColor], transition: {duration: 1.4}}
  };

  let oldText = parseFloat(oldValue).toFixed(2);
  let newText = parseFloat(newValue).toFixed(2);
  let text = [];
  let isDiff = false;
  newText.split('').forEach(function(val, i){
    if (val != oldText.charAt(i) || isDiff) {
      isDiff = true;
      text.push(<motion.span
        style={spanStyle}
        variants={variants}
        animate={controls}>{val}</motion.span>);  
    } else {
      text.push(val);
    }
  });
  return text;
}

export const getAnimationType = (lastPrice, prevLastPrice) => {
  if(!prevLastPrice || prevLastPrice === '0.00') {
    return;
  }
  const difference = lastPrice - prevLastPrice;
  let type = 'rest';
  if(difference > 0) {
    type = 'up';
  } else if (difference < 0) {
    type = 'down';
  }
  return type;
}

export const convertHexToRGBA = (hexCode, opacity = 1) => {
  let hex = hexCode.replace('#', '');
  
  if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }    
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
};

export const getLastClosePriceFromHtml = (lastPrice = 0, code) => {
  var div = document.createElement('div');
  div.innerHTML = code;
  const changeText = div?.childNodes?.[2]?.childNodes?.[3]?.childNodes?.[0]?.innerText || 0;
  return parseFloat(lastPrice) - parseFloat(changeText);
}