import React, {useState, useEffect, memo, useMemo, useCallback} from 'react';
import moment from 'moment';
import io from 'socket.io-client';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';
import { dollarFormat } from '~/utils';
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

const PriceContainer = memo(({price = '', closePrice = ''}) => {

  const getPriceColor = useCallback(() => {
    if (price > closePrice) {
      return styles.positive;
    } else if (price < closePrice) {
      return styles.negative;
    } else {
      return {};
    }
  }, [price, closePrice]);

  const getPriceDiff = useCallback(() => {
    const diff = price - closePrice;
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

    const formattedPrice = useMemo(() => `${dollarFormat(price || 0)}`, [price, dollarFormat]);
    return (
        <div className={styles.stockPrice}>
          <Price className={getPriceColor()}>{formattedPrice}</Price>
          {price && <Diff className={getPriceColor()}>{getPriceDiff()}</Diff>}
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

const LatestPrice = ({symbol = '', closePrice, ...props}) => {
    const [price, setPrice] = useState(null);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);

    useEffect(() => {
        let subscriptionId;
        if(!symbol) {
            return;
        }
        const socket = io({
            query: {
              symbol: JSON.stringify([symbol]),
              type: 'stock',
              thresholdLevel: 5
            }
          });

        socket.on('api message', data => {
            if(data?.subscriptionId) {
                subscriptionId = data?.subscriptionId;
                return;
            }
            const parseData = JSON.parse(data?.message)?.data;

            if(parseData[0] === 'T') {
                setPrice(parseData[9]);
                setLastUpdateTime(parseData[1]);
            }
        });

        socket.on('error', data => {
            console.log('error ->',data);
        })
        return () => {
            console.log(`unmount, unsubscribe id ${subscriptionId} and close socket`);
            socket.emit('unsubscribe', subscriptionId);
            socket.close();
        };
    }, [symbol])

    return (
        <div>
            <PriceContainer price={price} closePrice={closePrice}/>
            <LastUpdate lastUpdateTime={lastUpdateTime} />
        </div>
    )
}

export default LatestPrice;