import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import useTranslation from '~/hooks/useTranslation';
import IndexPrice from '~/components/market-indices/index-price';
import Carousel from '~/components/market/carousel';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import { useMounted } from '~/hooks/useMounted';
import IndicesSkeleton from '~/components/ui/indices-skeleton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 0 15px;
  min-width: ${(props) => (props.isFuture ? '130px' : '120px')};
  max-width: ${(props) => (props.isFuture ? '130px' : '120px')};
  &:last-child {
    padding-right: 15px;
  }
`;

const Label = styled.span`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  text-transform: uppercase;
`;

const LabelContainer = memo(({ label = '' }) => {
  const { t } = useTranslation();
  return <Label>{t(label)}</Label>;
});

const MarketIndices = () => {
  const [prices, setPrices] = useState([]);
  const isVisible = usePageVisibility();
  const isMounted = useMounted();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 1500);
    return () => clearInterval(interval);
  }, [isVisible, isMounted]);

  const getQuotes = useCallback(async () => {
    try {
      if (!isVisible) {
        console.log('page not visible, quit');
        return;
      }

      const res = await axios.get('/api/market/market-indices',{params: { market: 'US' }});
      if (res?.data && res?.data?.data) {
        setPrices(res?.data?.data);
      }
    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        console.log(thrown);
        console.log(thrown?.response);
      }
    }
  }, [prices, isVisible]);

  const renderQuoteContent = useCallback(data => {
    const { attr } = data?.data;
    const priceObj = {
      lastPrice: attr?.last_value,
      closePrice: attr?.last_close_value,
    };

    return (
      <Wrapper>
        <LabelContainer label={data?.symbol} />
        <IndexPrice priceObj={priceObj} />
      </Wrapper>
    );
  }, [prices])

  return (
    <Carousel>
      {prices?.length ? prices?.map((price) => {
        return (
          <React.Fragment key={price?.symbol}>
            {renderQuoteContent(price)}
          </React.Fragment>
        );
      }) : <IndicesSkeleton />}
    </Carousel>
  );
};

export default MarketIndices;
