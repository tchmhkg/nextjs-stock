import React, { useCallback, memo, useMemo, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAnimation } from 'framer-motion';
import styles from "~/components/market-indices/index-price.module.scss";
import { differenceBetweenValues } from "~/utils";
import { useTheme } from "~/theme";

const Wrapper = styled.div`
  justify-content: flex-end;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: bold;
  display: flex;
`;

const PriceDiff = styled.span`
  font-size: 12px;
`;

// custom hook for getting previous value 
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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
    if(prevLastPrice === '0.00') {
      return;
    }
    const difference = lastPrice - prevLastPrice;
    let type = 'rest';
    if(difference > 0) {
      type = 'up';
    } else if (difference < 0) {
      type = 'down';
    }
    startAnimation(type);
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
    return <Price>{pricesArray.map((priceChar, index) => <span key={index}>{priceChar}</span>)}</Price>;
  }, [lastPrice, closePrice, pricesArray]);

  const renderPriceDiff = useCallback(() => {
    return (
      <Price className={getPriceColor()}>
        <PriceDiff>{getPriceDiff()}</PriceDiff>
      </Price>
    );
  }, [lastPrice, closePrice]);

  return (
    <Wrapper>
      {renderLastPrice()} {renderPriceDiff()}
    </Wrapper>
  );
};

export default memo(IndexPrice);
