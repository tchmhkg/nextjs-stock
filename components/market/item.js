import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import styles from '~/components/market/item.module.scss';
import useTranslation from '~/hooks/useTranslation';
import { dollarFormat, getLastAndClosePriceFromYahoo } from '~/utils';
const ScheduleIcon = dynamic(import('@material-ui/icons/Schedule'));

const Container = styled(motion.div)`
  display: flex;
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;

const Name = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.inactiveLegend};
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

const ProfileWrapper = styled.div`
  display: flex;
  flex: 0.6;
  flex-direction: row;
  align-items: center;
`;

const LogoWrapper = styled.div`
  min-width: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
`;

const Logo = styled(Image)`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: contain;
`;

const Placeholder = styled.div`
  min-width: 35px;
  min-height: 35px;
  border-radius: 50%;
  background: ${(props) => props.theme.chartDataZoomBackground};
`;

const Remark = styled.div`
  font-size: 12px;
`;

const StockItem = ({ item }) => {
  const { locale, t } = useTranslation();
  const [profile, setProfile] = useState({});
  const { marketState, longName } = item;
  const { lastPrice, closePrice } = getLastAndClosePriceFromYahoo(item);

  const formattedPrice = useMemo(() => dollarFormat(lastPrice || 0, 3), [
    dollarFormat,
    lastPrice,
    closePrice,
  ]);

  useEffect(() => {
    if (item?.symbol) {
      getQuote(item.symbol);
    }
  }, []);

  const getQuote = async () => {
    try {
      const res = await axios.get('/api/market/quote', {
        params: { symbol: item.symbol },
      });
      if (res?.data) {
        setProfile(res?.data?.profile);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      return '0(+0%)';
    } else {
      return '-';
    }
  }, [lastPrice, closePrice]);

  const renderLogo = useMemo(
    () =>
      profile?.logo ? (
        <LogoWrapper>
          <Logo src={profile?.logo} width={35} height={35} />
        </LogoWrapper>
      ) : (
        <Placeholder />
      ),
    [profile?.logo]
  );

  const SymbolContainer = memo(({ symbol }) => <Symbol>{symbol}</Symbol>);

  return (
    <Link
      href={`/[lang]/market/[symbol]]`}
      as={`/${locale}/market/${item.symbol}`}
    >
      <Container layoutId={item.symbol} initial={false}>
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
          {['PRE', 'POSTPOST', 'CLOSED', 'PREPRE', 'PREPARE'].includes(marketState) && (
            <Remark>{t(marketState)}</Remark>
          )}
        </div>
      </Container>
    </Link>
  );
};

export default React.memo(StockItem);
