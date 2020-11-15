import React, {useCallback, memo} from 'react';
import styled from 'styled-components';
import styles from "~/components/market-indices/index-price.module.css";

const Price = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const IndexPrice = ({priceObj, isFuture = false}) => {
  const getPriceColor = () => {
    const lastPrice = (isFuture
      ? priceObj?.lastPriceInDouble
      : priceObj?.lastPrice)?.toFixed(2);
    const closePrice = (isFuture
      ? priceObj?.closePriceInDouble
      : priceObj?.closePrice)?.toFixed(2);
    if (lastPrice > closePrice) {
      return styles.positive;
    } else if (lastPrice < closePrice) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = () => {
    const lastPrice = (isFuture
      ? priceObj?.lastPriceInDouble
      : priceObj?.lastPrice)?.toFixed(2);
    const closePrice = (isFuture
      ? priceObj?.closePriceInDouble
      : priceObj?.closePrice)?.toFixed(2);
    const diff = lastPrice - closePrice;
    const diffPercent = (diff / closePrice) * 100;
    if (diff > 0) {
      return `+${diff?.toFixed(2)}(+${diffPercent?.toFixed(2)}%)`;
    } else if (diff < 0) {
      return `${diff?.toFixed(2)}(${diffPercent?.toFixed(2)}%)`;
    } else if (diff === 0) {
      return '0(+0%)';
    } else {
      return '';
    }
  };

  const renderLastPrice = useCallback(() => {
    return (
      <Price className={getPriceColor()}>
        {isFuture
          ? priceObj?.lastPriceInDouble?.toFixed(2)
          : priceObj?.lastPrice?.toFixed(2)}
      </Price>
    );
  }, [priceObj?.lastPriceInDouble, priceObj?.lastPrice]);

  const renderPriceDiff = useCallback(() => {
    return (
      <Price className={getPriceColor()}>
        <span className={styles.priceDiff}>{getPriceDiff()}</span>
      </Price>
    );
  }, [priceObj?.lastPriceInDouble, priceObj?.lastPrice]);

  return (
    <div style={{justifyContent: 'flex-end'}}>
      {renderLastPrice()}
      {renderPriceDiff()}
    </div>
  );
};

export default memo(IndexPrice);
