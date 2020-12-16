import { useCallback, memo, useMemo, useState, useEffect, useRef } from "react";
import { useAnimation } from 'framer-motion';
import styles from "~/components/market-indices/index-price.module.scss";
import { differenceBetweenValues, getAnimationType } from "~/utils";
import { useTheme } from "~/theme";
import { usePrevious } from "~/hooks/usePrevious";

const getLastPrice = (priceObj, isFuture) => {
  return parseFloat((isFuture ? priceObj?.lastPriceInDouble : priceObj?.lastPrice) || 0).toFixed(2)
}
const getClosePrice = (priceObj, isFuture) => {
  return parseFloat((isFuture ? priceObj?.closePriceInDouble : priceObj?.closePrice) || 0).toFixed(2)
}

const IndexPrice = ({ priceObj = {}, isFuture = false }) => {
  const [prices, setPrices] = useState(priceObj);
  const { colors } = useTheme();
  const prevPrices = usePrevious(prices);
  const controls = useAnimation();

  useEffect(() => {
    setPrices(priceObj)
  }, [priceObj])

  const lastPrice = useMemo(
    () => getLastPrice(prices, isFuture),
    [prices?.lastPriceInDouble, prices?.lastPrice, getLastPrice]
  );
  const closePrice = useMemo(
    () => getClosePrice(prices, isFuture),
    [prices?.closePriceInDouble, prices?.closePrice, getClosePrice]
  );

  const prevLastPrice = getLastPrice(prevPrices, isFuture);

  const pricesArray = differenceBetweenValues({
    oldValue: prevLastPrice, 
    newValue: lastPrice,
    controls,
    theme: colors
  });

  const startAnimation = async (type) => await controls.start(type);

  useEffect(() => {
    const type = getAnimationType(lastPrice, prevLastPrice);
    if(type) {
      startAnimation(type);
    }
  }, [prices])

  const getPriceColor = useCallback(() => {
    if (lastPrice === 0) {
      return "";
    }
    if (lastPrice > closePrice) {
      return styles.positive;
    } else if (lastPrice < closePrice) {
      return styles.negative;
    } else {
      return "";
    }
  }, [lastPrice, closePrice]);

  const getPriceDiff = useCallback(() => {
    const diff = lastPrice && lastPrice > 0 ? lastPrice - closePrice : 0;
    const diffPercent = (diff / closePrice) * 100;

    if (diff > 0) {
      return `+${diff?.toFixed(2)}(+${diffPercent?.toFixed(2)}%)`;
    } else if (diff < 0) {
      return `${diff?.toFixed(2)}(${diffPercent?.toFixed(2)}%)`;
    } else if (diff === 0) {
      return "0(+0%)";
    } else {
      return "";
    }
  }, [lastPrice, closePrice]);

  const renderLastPrice = useCallback(() => {
    // const price = parseFloat((lastPrice ? lastPrice : closePrice))?.toFixed(2);
    return <div className={styles.price}>{pricesArray.map((priceChar, index) => <span key={index}>{priceChar}</span>)}</div>;
  }, [lastPrice, closePrice, pricesArray]);

  const renderPriceDiff = useCallback(() => {
    return (
      <div className={`${styles.price} ${getPriceColor()}`}>
        <div className={styles.priceDiff}>{getPriceDiff()}</div>
      </div>
    );
  }, [lastPrice, closePrice]);

  return (
    <div className={styles.wrapper}>
      {renderLastPrice()} {renderPriceDiff()}
    </div>
  );
};

export default memo(IndexPrice);
