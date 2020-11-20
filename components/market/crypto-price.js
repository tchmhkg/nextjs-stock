import React, {useMemo, memo} from 'react';
import moment from 'moment';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';
import { dollarFormat } from '~/utils';

const Price = styled.span`
    font-size: 22px;
    font-weight: bold;
`;

const CURRENCY_MAP = {
    'USD': '$',
    'JPY': '¥',
    'HKD': 'HK$'
};

const Name = memo(({name = ''}) => {
    const formattedName = useMemo(() => name ? ((name?.slice(0, 3) + "/" + name?.slice(3)).toUpperCase()) : '', [name])

    return <span>{formattedName}</span>
})

const LastUpdate = memo(({lastUpdateTime = ''}) => {
    const { t } = useTranslation();
    const formattedTime = useMemo(() => moment(lastUpdateTime).format('YYYY-MM-DD HH:mm:ss'), [lastUpdateTime, moment])
    return (
        <div>{t('Last update time')}: {formattedTime}</div>
    )
})

const CryptoPrice = ({item = {}}) => {
    // console.log('render CryptoPrice ->',item.key);
    const CURR = (item.key?.substr(-3))?.toUpperCase();
    const formattedPrice = useMemo(() => `${CURRENCY_MAP[CURR]}${dollarFormat(item.price || 0)}`, [CURR, item.price, dollarFormat]);
    
    return (
        <div>
            <div><Name name={item.key}/>: <Price>{formattedPrice}</Price></div>
            <LastUpdate lastUpdateTime={item.lastUpdateTime}/>
        </div>
    )
}

function pricePropsAreEqual(prev, next) {
    // console.log(prev.item?.key,', prev price =>',prev.item?.price, ', next price =>',next.item?.price, ', return => ',prev.item?.key === next.item?.key && prev.item?.price === next.item?.price);
    return prev.item?.key === next.item?.key && prev.item?.price === next.item?.price;
  }

export default React.memo(CryptoPrice, pricePropsAreEqual);