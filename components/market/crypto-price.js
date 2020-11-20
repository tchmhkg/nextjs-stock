import React, {useMemo} from 'react';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const Price = styled.span`
    font-size: 22px;
    font-weight: bold;
`;

const CryptoPrice = ({item = {}}) => {
    const { t } = useTranslation();
    // console.log('render CryptoPrice ->',item.key);
    const CURR = item.key?.substr(-3);
    const formattedName = useMemo(() => (item.key?.slice(0, 3) + "/" + item.key?.slice(3)).toUpperCase(), [item.key])
    const formattedPrice = useMemo(() => new Intl.NumberFormat({},{ style: 'currency', currency: CURR, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2 }).format(item.price || 0), [CURR, item.price]);

    return (
        <div>
            <div>{formattedName}: <Price>{formattedPrice}</Price></div>
            <div>{t('Last update time')}: {item.lastUpdateTime}</div>
        </div>
    )
}

function pricePropsAreEqual(prev, next) {
    // console.log(prev.item?.key,', prev price =>',prev.item?.price, ', next price =>',next.item?.price, ', return => ',prev.item?.key === next.item?.key && prev.item?.price === next.item?.price);
    return prev.item?.key === next.item?.key && prev.item?.price === next.item?.price;
  }

export default React.memo(CryptoPrice, pricePropsAreEqual);