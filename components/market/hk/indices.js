import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import useTranslation from '~/hooks/useTranslation';
// import { dollarFormat } from '~/utils';
import IndexPrice from '~/components/market-indices/index-price';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import IndicesSkeleton from '~/components/ui/indices-skeleton';
import Carousel from '~/components/market/carousel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 250px;
  padding: 0 15px;
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

const HKIndices = () => {
  const [prices, setPrices] = useState([]);
  const isVisible = usePageVisibility();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 1500);
    return () => clearInterval(interval);
  }, [isVisible]);

  const getQuotes = useCallback(async () => {
    try {
      if (!isVisible) {
        console.log('page not visible, quit');
        return;
      }
      const res = await axios.get('/api/market/market-indices', {
        params: { market: 'HK' },
      });
      if (res?.data && res?.data?.data) {
        // console.log(res?.data?.data);
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
        )
      }) : <IndicesSkeleton />}
    </Carousel>
  );
};

export default HKIndices;
