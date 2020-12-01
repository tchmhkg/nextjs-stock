import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import useTranslation from '~/hooks/useTranslation';
import { dollarFormat } from '~/utils';
import IndexPrice from '~/components/market-indices/index-price';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 250px;
  @media (max-width: 768px) {
    min-width: ${(props) => (props.isFuture ? '180px' : '150px')};
  }
`;

const Label = styled.span`
  color: ${(props) => props.theme.text};
  font-size: 18px;
  text-transform: uppercase;
`;

const LabelContainer = memo(({ label = '' }) => {
  const { t } = useTranslation();
  return <Label>{t(label)}</Label>;
});

const Price = styled.span`
  font-size: 20px;
  font-weight: bold;
  display: flex;
`;

const HKIndices = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getQuotes = useCallback(() => {
    axios
      .get('/api/market/market-indices', {
        params: { market: 'HK' },
      })
      .then((res) => {
        if (res?.data && res?.data?.data) {
          console.log(res?.data?.data);
          setPrices(res?.data?.data);
        }
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log(thrown);
          console.log(thrown?.response);
        }
      });
  }, [prices]);
  return (
    <Container>
      {prices?.map((price) => {
        const { candles, attr } = price?.data;
        const priceObj = {
          lastPrice: attr?.last_value,
          closePrice: candles[candles.length - 2][4],
        };
        return (
          <Wrapper key={price?.symbol}>
            <LabelContainer label={price?.symbol} />
            <IndexPrice priceObj={priceObj} />
          </Wrapper>
        );
      })}
    </Container>
  );
};

export default HKIndices;
