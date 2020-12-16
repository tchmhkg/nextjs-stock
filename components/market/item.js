import React, { useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

import styles from '~/components/market/item.module.scss';
import useTranslation from '~/hooks/useTranslation';
import { differenceBetweenValues, getAnimationType, getLastAndClosePriceFromYahoo } from '~/utils';
import { useTheme } from '~/theme';
import { usePrevious } from '~/hooks/usePrevious';
import { useWindowSize } from '~/hooks/useWindowSize';

const ClockIcon = dynamic(import('~/components/ui/icon').then((mod) => mod.ClockIcon));
const LineChart = dynamic(import('./line-chart'));

const Container = styled(motion.div)`
  display: flex;
  flex: 1;
  padding: 10px 0;
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
`;

const Diff = styled.span`
  font-size: 12px;
  font-weight: bold;
`;

const ProfileWrapper = styled.div`
  display: flex;
  width: 45%;
  flex-direction: row;
  align-items: center;
`;

const LineChartWrapper = styled.div`
  pointer-events: none;
  width: 20%;
`;

const StockItem = ({ item }) => {
  const { colors } = useTheme();
  const { locale, t } = useTranslation();
  const { longName } = item;
  const { lastPrice, closePrice } = getLastAndClosePriceFromYahoo(item);
  const prevLastPrice = usePrevious(lastPrice);
  const controls = useAnimation();
  const {width: windowWidth} = useWindowSize();

  const pricesArray = differenceBetweenValues({
    oldValue: prevLastPrice, 
    newValue: lastPrice,
    controls,
    theme: colors
  });

  useEffect(() => {
    const type = getAnimationType(lastPrice, prevLastPrice);
    if(type) {
      startAnimation(type);
    }
  }, [item, prevLastPrice, lastPrice])

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

  const SymbolContainer = memo(({ symbol }) => <Symbol>{symbol}</Symbol>);
  const startAnimation = async (type) => await controls.start(type);

  const renderLastPrice = useCallback(() => {
    return <Price>{pricesArray.map((priceChar, index) => <span key={index}>{priceChar}</span>)}</Price>;
  }, [lastPrice, pricesArray]);

  return (
    <Link
      href={`/[lang]/market/[symbol]]`}
      as={`/${locale}/market/${item.symbol}`}
    >
      <Container layoutId={item.symbol} initial={false}>
        <ProfileWrapper>
          <div className={styles.stockInfo}>
            <SymbolContainer symbol={item.symbol} />
            <Name>{longName}</Name>
          </div>
        </ProfileWrapper>
        {!(windowWidth < 375) && (
          <LineChartWrapper>
            <LineChart symbol={item.symbol} />
          </LineChartWrapper>
        )}
        <div className={styles.stockPrice}>
          <PriceWrapper>
            {item?.quoteSourceName === 'Delayed Quote' && <ClockIcon />}
            {renderLastPrice()}
          </PriceWrapper>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
        </div>
      </Container>
    </Link>
  );
};

export default React.memo(StockItem);
