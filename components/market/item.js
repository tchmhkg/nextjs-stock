import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

import styled from "styled-components";
import styles from "~/components/market/item.module.scss";
import useTranslation from "~/hooks/useTranslation";
import { dollarFormat } from '~/utils';
import ScheduleIcon from '@material-ui/icons/Schedule';

const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

const Name = styled.span`
  font-size: 14px;
  color: #b2b2b2;
`;

const Symbol = styled.span`
  font-size: 18px;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Price = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin-left: 5px;
`;

const Diff = styled.span`
  font-size: 14px;
`;

const StockItem = ({ item, refreshing }) => {
  const { locale } = useTranslation();
  const { lastPrice = item.lastPriceInDouble, closePrice } = item;
  const formattedPrice = useMemo(() => dollarFormat(lastPrice, 3), [dollarFormat, lastPrice]);

  const getPriceColor = useCallback(() => {
    if (lastPrice > closePrice) {
      return styles.positive;
    } else if (lastPrice < closePrice) {
      return styles.negative;
    } else {
      return '';
    }
  }, [lastPrice, closePrice]);

  const getPriceDiff = useCallback(() => {
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
  }, [lastPrice, closePrice]);

  return (
    <Link
      href={`/[lang]/market/[symbol]]`}
      as={`/${locale}/market/${item.symbol}`}
    >
      <Container>
        <div className={styles.stockInfo}>
          <Symbol>{item.symbol}</Symbol>
          <Name>{item.description || item.name}</Name>
        </div>
        <div className={styles.stockPrice}>
          <PriceWrapper>
            <ScheduleIcon fontSize="small" />
            <Price className={getPriceColor()}>{formattedPrice}</Price>
          </PriceWrapper>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
        </div>
      </Container>
    </Link>
  );
};

export default React.memo(StockItem);
