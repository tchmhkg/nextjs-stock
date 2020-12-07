import React, {useState, useEffect, memo, useMemo, useCallback} from 'react';
import moment from 'moment';
import SocketIOClient from 'socket.io-client';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';
import { dollarFormat, getLastAndClosePriceFromYahoo } from '~/utils';
import styles from "~/components/market/latest-price.module.scss";

const Price = styled.span`
    font-size: 26px;
    font-weight: bold;
`;

const Diff = styled.span`
  font-size: 16px;
`;

const LastUpdateText = styled.div`
    font-size: 14px;
    margin-bottom: 10px;
`;

const PriceContainer = memo(({price = 0, closePrice = 0}) => {
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
          <Price className={getPriceColor()}>{formattedPrice}</Price>
          <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>
        </div>
    )
})

const LastUpdate = memo(({lastUpdateTime = ''}) => {
    const { t } = useTranslation();
    const formattedTime = useMemo(() => lastUpdateTime ? moment(lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '', [lastUpdateTime, moment])
    return (
        <LastUpdateText>{t('Last update time')}: {formattedTime}</LastUpdateText>
    )
})

const LatestPrice = ({symbol = '', ...props}) => {
    const [price, setPrice] = useState(0);
    const [closePrice, setClosePrice] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);

    useEffect(() => {
      if(!symbol) {
        return;
      }
      const socket = SocketIOClient({
        query: {
          symbol,
        },
      });
      socket.on("FromAPI", data => {
        // console.log('from api data => ',data)
        const { lastPrice, closePrice: apiClosePrice } = getLastAndClosePriceFromYahoo(data[0]);
        setPrice(lastPrice);
        setClosePrice(apiClosePrice)
        // setLastUpdateTime(data);
      });
      return () => socket.disconnect();
    }, [symbol])

    return (
        <div>
            <PriceContainer price={price} closePrice={closePrice}/>
            {lastUpdateTime && <LastUpdate lastUpdateTime={lastUpdateTime} />}
        </div>
    )
}

export default LatestPrice;