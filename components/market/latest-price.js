import React, {useState, useEffect, memo, useMemo, useCallback} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import axios from 'axios';
import useSWR from 'swr';
import styles from "~/components/market/latest-price.module.scss";
import { useAnimation } from 'framer-motion';
import { differenceBetweenValues, getAnimationType, getLastAndClosePriceFromYahoo } from '~/utils';
import { useTheme } from '~/theme';
import { usePrevious } from '~/hooks/usePrevious';
import { usePageVisibility } from '~/hooks/usePageVisibility';

const ClockIcon = dynamic(() =>
  import('~/components/ui/icon').then((mod) => mod.ClockIcon)
)

const Price = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin-left: 5px;
`;

const Diff = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PriceContainer = memo(({price = 0, closePrice = 0, isDelayed}) => {
  const { colors } = useTheme();
  const prevLastPrice = usePrevious(price);
  const controls = useAnimation();
  const startAnimation = async (type) => await controls.start(type);

  const pricesArray = differenceBetweenValues({
    oldValue: prevLastPrice, 
    newValue: price,
    controls,
    theme: colors
  });

  useEffect(() => {
    const type = getAnimationType(price, prevLastPrice);
    if(type) {
      startAnimation(type);
    }
  }, [prevLastPrice, price])

  const getPriceColor = useCallback(() => {
    if (price === 0) {
      return '';
    }
    if (price > closePrice) {
      return styles.positive;
    } else if (price < closePrice) {
      return styles.negative;
    } else {
      return '';
    }
  }, [price, closePrice]);

  const getPriceDiff = useCallback(() => {
    const diff = price > 0 ? price - closePrice : 0;
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
  }, [price, closePrice]);

    return (
        <div className={styles.stockPrice}>
          <PriceWrapper>
            {isDelayed && <ClockIcon />}
            <Price>{pricesArray.map((priceChar, index) => <span key={index}>{priceChar}</span>)}</Price>
          </PriceWrapper>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
        </div>
    )
})

const fetcher = (url, params) => axios.get(url, {params}).then(res => {
  const result = res?.data?.data?.[0] || {};
  const { lastPrice, closePrice: apiClosePrice } = getLastAndClosePriceFromYahoo(result);
  return {lastPrice, apiClosePrice, marketState: result.marketState};
});

const LatestPrice = ({symbol = '', data = {}, isDelayed = false, ...props}) => {
    const [price, setPrice] = useState(data.lastPrice || 0);
    const [closePrice, setClosePrice] = useState(data.closePrice || 0);
    const isVisible = usePageVisibility();
    const params = useMemo(() => ({symbol}), [symbol]);
    const { data: prices, error } = useSWR([(isVisible && symbol) ? '/api/market/quotes' : null, params], fetcher, {refreshInterval: 2500})

    useEffect(() => {
      if(prices?.marketState !== 'CLOSED') {
        setPrice(prices?.lastPrice);
        setClosePrice(prices?.apiClosePrice);
      }
    }, [prices?.lastPrice, prices?.apiClosePrice, prices?.marketState])

    return (
        <div>
            <PriceContainer price={price} closePrice={closePrice} isDelayed={isDelayed}/>
        </div>
    )
}

export default LatestPrice;