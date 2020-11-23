import React, { useCallback, memo, useMemo } from "react";
import styled from "styled-components";
import styles from "~/components/market-indices/index-price.module.scss";

const Wrapper = styled.div`
  justify-content: flex-end;
`;

const Price = styled.span`
  font-size: 20px;
  font-weight: bold;
  display: flex;
`;

const PriceDiff = styled.span`
  font-size: 13px;
`;

const IndexPrice = ({ priceObj, isFuture = false }) => {
  const lastPrice = useMemo(
    () => (isFuture ? priceObj?.lastPriceInDouble : priceObj?.lastPrice),
    [priceObj?.lastPriceInDouble, priceObj?.lastPrice]
  );
  const closePrice = useMemo(
    () => (isFuture ? priceObj?.closePriceInDouble : priceObj?.closePrice),
    [priceObj?.closePriceInDouble, priceObj?.closePrice]
  );
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
    const price = (lastPrice ? lastPrice : closePrice)?.toFixed(2);
    return <Price className={getPriceColor()}>{price}</Price>;
  }, [lastPrice, closePrice]);

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
