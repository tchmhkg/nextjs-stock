import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import moment from 'moment';

const Price = styled.span`
    font-size: 22px;
    font-weight: bold;
`;

const BTC_USD = 'btcusd';
const Crypto = ({...props}) => {
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [lastUpdateTime, setLastUpdateTime] = useState(null);

    useEffect(() => {
        const socket = io({
            query: {
              symbol: BTC_USD
            }
          });

        socket.on('api message', data => {
            const parseData = JSON.parse(data?.message)?.data;
            // console.log('api message =>', parseData);
            setPrice(parseData[6]);
            setLastUpdateTime(moment(parseData?.[2]).format('YYYY-MM-DD HH:mm:ss'))
            if(parseData[1] !== name) {
                setName(parseData[1]);
            }
        });

        socket.on('error', data => {
            console.log('error ->',data);
        })
        return () => {
            console.log('unmount, close socket');
            socket.close();
        };
    }, [BTC_USD])

    return (
        <div>
            <h4>BTC live price</h4>
            {name ? <div>{name}: <Price>${price?.toFixed(2)}</Price></div> : <div>N/A</div>}
            <div>{lastUpdateTime}</div>
        </div>
    )
}

export default Crypto;