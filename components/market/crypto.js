import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import CryptoPrice from '~/components/market/crypto-price';
import useTranslation from '~/hooks/useTranslation';

const BTC_USD = 'btcusd';
const symbolList = ['btcusd', 'btcjpy'];
const Crypto = ({symbol = BTC_USD, ...props}) => {
    const [prices, setPrices] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const socket = io({
            query: {
              symbol: JSON.stringify(symbolList)
            }
          });

        socket.on('api message', data => {
            const parseData = JSON.parse(data?.message)?.data;
            // console.log('api message =>', parseData);
            setPrices(prevState => {
                const newState = symbolList.map(item => {
                    // console.log(item);
                    if(item === parseData[1]) {
                        return {
                            key: item,
                            price: parseData[6],
                            lastUpdateTime: moment(parseData?.[2]).format('YYYY-MM-DD HH:mm:ss')
                        };
                    } else {
                        const oriData = prevState.find(prev => prev.key === item);
                        return {
                            key: item,
                            price: oriData?.price,
                            lastUpdateTime: oriData?.lastUpdateTime
                        }
                    }
                })
                return newState;
            });
        });

        socket.on('error', data => {
            console.log('error ->',data);
        })
        return () => {
            console.log('unmount, close socket');
            socket.close();
        };
    }, [])

    return (
        <div>
            <h4>{t('BTC real-time quote')}</h4>
            {symbolList?.map(symbol => {
                const item = prices?.find(p => p.key === symbol);
                if(!item) {
                    return null;
                }
                return (
                    <CryptoPrice key={symbol} item={item}/>
                )
            })}
        </div>
    )
}

export default Crypto;