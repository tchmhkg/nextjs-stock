import {useState, useEffect, memo, useMemo, useCallback} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import axios from 'axios';
import useSWR from 'swr';
import styles from "~/components/market/latest-price.module.scss";
import { useAnimation } from 'framer-motion';
import { differenceBetweenValues, getAnimationType, getPricesFromYahoo } from '~/utils';
import { useTheme } from '~/theme';
import { usePrevious } from '~/hooks/usePrevious';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import DayHighLow from '~/components/market/day-high-low';
import useTranslation from '~/hooks/useTranslation';

const ClockIcon = dynamic(() =>
  import('~/components/ui/icon').then((mod) => mod.ClockIcon)
)

const MarketState = styled.div`
  position: absolute;
  right: 50px;
  top: -25px;
  font-size: 14px;
  color: ${props => props.theme.text}
`;

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.inactiveLegend};
`;

const Symbol = styled.span`
  font-size: 24px;
  font-weight: bold;
  display: inline-block;
`;

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

const SymbolNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  const result = res?.data?.data || {};

  const { lastPrice, closePrice: apiClosePrice } = getPricesFromYahoo(result);
  const {marketState, longName, regularMarketDayHigh, regularMarketDayLow, quoteSourceName} = result;
  return {lastPrice, apiClosePrice, marketState, longName, regularMarketDayHigh, regularMarketDayLow, quoteSourceName};
});

const LatestPrice = ({symbol = '', data = {}, isDelayed = false, ...props}) => {
    const {t} = useTranslation();
    const [price, setPrice] = useState(data.lastPrice || 0);
    const [closePrice, setClosePrice] = useState(data.closePrice || 0);
    const [name, setName] = useState(null);
    const isVisible = usePageVisibility();
    const params = useMemo(() => ({symbol}), [symbol]);
    const { data: prices, error } = useSWR([(isVisible && symbol) ? '/api/market/price' : null, params], fetcher, {refreshInterval: 2500})
    useEffect(() => {
      if(prices?.longName) {
        setName(prices?.longName)
      }
      if(prices?.marketState !== 'CLOSED') {
        setPrice(prices?.lastPrice);
        setClosePrice(prices?.apiClosePrice);
      }
    }, [prices?.lastPrice, prices?.apiClosePrice, prices?.marketState])

    return (
        <Container>
          <Wrapper>
            <HeaderContainer symbol={symbol} name={name} />
            <PriceContainer price={price} closePrice={closePrice} isDelayed={prices?.quoteSourceName === 'Delayed Quote'}/>
            {prices?.marketState && <MarketState>{t(prices?.marketState)}</MarketState>}
          </Wrapper>
          <DayHighLow high={prices?.regularMarketDayHigh?.raw} low={prices?.regularMarketDayLow?.raw}/>
        </Container>
    )
}

const HeaderContainer = memo(({ symbol, name }) => {
  return (
    <Header>
      <SymbolNameWrapper>
        <Symbol>{symbol} </Symbol>
        {name && <Name>{name}</Name>}
      </SymbolNameWrapper>
    </Header>
  );
});

export default LatestPrice;