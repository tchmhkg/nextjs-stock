import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from 'axios';
import styled from "styled-components";
import ScheduleIcon from '@material-ui/icons/Schedule';
import { motion } from "framer-motion";

import styles from "~/components/market/item.module.scss";
import useTranslation from "~/hooks/useTranslation";
import { dollarFormat } from '~/utils';

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
  color: ${props => props.theme.inactiveLegend};
`;

const Symbol = styled(motion.span)`
  font-size: 18px;
  display: inline-block;
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

const ProfileWrapper = styled.div`
  display: flex;
  flex: 0.6;
  flex-direction: row;
  align-items: center;
`;

const Logo = styled(Image)`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: contain;
`;

const Placeholder = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.theme.chartDataZoomBackground};
`;

const Remark = styled.div`
  font-size: 12px;
`;

const StockItem = ({ item }) => {
  const { locale, t } = useTranslation();
  const [profile, setProfile] = useState({});
  const { marketState, longName } = item;
  let lastPrice = 0;
  let closePrice = 0;
  if(marketState === 'PRE') {
    lastPrice = item?.preMarketPrice;
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
  // const { c: lastPrice, pc: closePrice } = quote || 0;
  const formattedPrice = useMemo(() => dollarFormat(lastPrice || 0, 3), [dollarFormat, lastPrice, closePrice]);

  useEffect(() => {
    if(item?.symbol) {
      getQuote(item.symbol);
    }
  }, [])

  // useEffect(() => {
  //   if(refreshing && item?.symbol) {
  //     getQuote(item.symbol)
  //   }
  // }, [refreshing])

  const getQuote = async () => {
    try {
      const res = await axios.get('/api/market/quote', {params: {symbol: item.symbol}});
      // setIsRefreshing(false);
      if (res?.data) {
        // console.log(res?.data);
        // setQuote(res?.data?.quote);
        setProfile(res?.data?.profile);
      }
    } catch (err) {
      console.log(err);
      // setIsRefreshing(false);
    }
  }

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

  const renderLogo = useMemo(() => profile?.logo ? (
    <Logo 
      src={profile?.logo}
      width={35}
      height={35}
    />
  ) : <Placeholder />, [profile?.logo]);

  const SymbolContainer = memo(({symbol}) => (
    <Symbol layoutId={symbol}>{symbol}</Symbol>
  ))

  return (
    <Link
      href={{
        pathname: '/[lang]/market/quote',
        query: { lang: locale, symbol: item.symbol },
      }}
    >
      <Container>
        <ProfileWrapper>
          {renderLogo}
          <div className={styles.stockInfo}>
            <SymbolContainer symbol={item.symbol} />
            <Name>{longName}</Name>
          </div>
        </ProfileWrapper>
        <div className={styles.stockPrice}>
          <PriceWrapper>
            {item?.quoteSourceName === 'Delayed Quote' && (
              <ScheduleIcon fontSize="small" />
            )}
            <Price className={getPriceColor()}>{formattedPrice}</Price>
          </PriceWrapper>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
          {['PRE', 'POSTPOST', 'CLOSED'].includes(marketState) && (
            <Remark>{t(marketState)}</Remark>
          )}
        </div>
      </Container>
    </Link>
  );
};

export default React.memo(StockItem);
