import React, {useState, useEffect, memo, useMemo, useCallback} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import axios from 'axios';
import styles from "~/components/market/latest-price.module.scss";
import { dollarFormat, getLastAndClosePriceFromYahoo } from '~/utils';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { useMounted } from '~/hooks/useMounted';

const ScheduleIcon = dynamic(import('@material-ui/icons/Schedule'));

const Price = styled.span`
  font-size: 26px;
  font-weight: bold;
  margin-left: 5px;
`;

const Diff = styled.span`
  font-size: 16px;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PriceContainer = memo(({price = 0, closePrice = 0, isDelayed}) => {
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

    const formattedPrice = useMemo(() => `${dollarFormat(price || closePrice, 3)}`, [price, closePrice, dollarFormat]);
    return (
        <div className={styles.stockPrice}>
          <PriceWrapper>
            {isDelayed && <ScheduleIcon fontSize="small" />}
            <Price className={getPriceColor()}>{formattedPrice}</Price>
          </PriceWrapper>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
        </div>
    )
})

const LatestPrice = ({symbol = '', data = {}, isDelayed = false, ...props}) => {
    const [price, setPrice] = useState(data.lastPrice || 0);
    const [closePrice, setClosePrice] = useState(data.closePrice || 0);
    const isVisible = usePageVisibility();
    const isMounted = useMounted();

    useEffect(() => {
      const interval = setInterval(async () => {
        getQuotes();
      }, 1000);
      return () => clearInterval(interval);
    }, [isVisible, symbol, isMounted]);
  
    const getQuotes = () => {
      if(!symbol) {
        return;
      }
      if(!isVisible) {
        console.log('stock detail page not visible, quit');
        return;
      }
      axios
        .get('/api/market/quotes', {
          params: {
            symbol
          }
        })
        .then((res) => {
          if (res?.data) {
            const result = res?.data?.data?.[0] || {};
            const { lastPrice, closePrice: apiClosePrice } = getLastAndClosePriceFromYahoo(result);
            if(result.marketState !== 'CLOSED') {
              setPrice(lastPrice);
              setClosePrice(apiClosePrice)
            }
          }
        })
        .catch(function (thrown) {
            console.log(thrown);
        });
    };

    return (
        <div>
            <PriceContainer price={price} closePrice={closePrice} isDelayed={isDelayed}/>
        </div>
    )
}

export default LatestPrice;