import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import styled from "styled-components";
import styles from "./item.module.css";

const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const Name = styled.span`
  font-size: 14px;
  color: #b2b2b2;
`;

const Symbol = styled.span`
  font-size: 18px;
`;

const Price = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const Diff = styled.span`
  font-size: 14px;
`;

const StockItem = ({ item, refreshing }) => {
  const { lastPrice = item.lastPriceInDouble, closePrice } = item;

  const getPriceColor = () => {
    if (lastPrice > closePrice) {
      return styles.positive;
    } else if (lastPrice < closePrice) {
      return styles.negative;
    } else {
      return {};
    }
  };

  const getPriceDiff = () => {
    const diff = lastPrice - closePrice;
    const diffPercent = (diff / closePrice) * 100;
    if (diff > 0) {
      return `+${diff.toFixed(3)}(+${diffPercent.toFixed(2)}%)`;
    } else if (diff < 0) {
      return `${diff.toFixed(3)}(${diffPercent.toFixed(2)}%)`;
    } else if (diff === 0) {
      return "0(+0%)";
    } else {
      return "-";
    }
  };

  return (
    <Link href={`/market/${item.symbol}`}>
      <Container>
        <div className={styles.stockInfo}>
          <Symbol>{item.symbol}</Symbol>
          <Name>{item.description || item.name}</Name>
        </div>
        <div className={styles.stockPrice}>
          <Price className={getPriceColor()}>{lastPrice}</Price>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
        </div>
      </Container>
    </Link>
  );
};

export default React.memo(StockItem);
