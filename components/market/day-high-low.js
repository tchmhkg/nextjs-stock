import React, {memo} from 'react';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const Price = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.text}
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`;

const DayHighLow = memo(({high = 0, low = 0}) => {
  const { t } = useTranslation();
  return (
    <PriceWrapper>
      <Price>{t('Day high')}: {high}</Price>
      <Price>{t('Day low')}: {low}</Price>
    </PriceWrapper>
  )
})

export default DayHighLow;