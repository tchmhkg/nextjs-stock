import React, { useCallback, memo } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import styled from 'styled-components';

import useTranslation from '~/hooks/useTranslation';
import IndexPrice from '~/components/market-indices/index-price';
import Carousel from '~/components/market/carousel';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import IndicesSkeleton from '~/components/ui/indices-skeleton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 0 15px;
  min-width: ${(props) => (props.isFuture ? '140px' : '120px')};
  max-width: ${(props) => (props.isFuture ? '140px' : '120px')};
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

const fetcher = url => axios.get(url).then(res => Object.values(res.data?.data));

const MarketIndices = () => {
  const isVisible = usePageVisibility();
  const { data: prices, error } = useSWR(isVisible ? '/api/market/indices' : null, fetcher, {refreshInterval: 1500})

  const renderIndexContent = useCallback(
    (priceObj) => {
      return (
        <Wrapper key={priceObj?.symbol}>
          <LabelContainer label={priceObj?.symbol} />
          <IndexPrice priceObj={priceObj} />
        </Wrapper>
      );
    },
    [prices]
  );

  const renderFutureContent = useCallback(
    (priceObj) => {
      return (
        <Wrapper isFuture key={priceObj?.symbol}>
          <LabelContainer label={priceObj?.symbol} />
          <IndexPrice priceObj={priceObj} isFuture />
        </Wrapper>
      );
    },
    [prices]
  );

  return (
    <Carousel>
      {prices?.length ? prices?.map((priceObj) => {
        if (priceObj.assetType === 'INDEX') {
          return renderIndexContent(priceObj);
        } else {
          return renderFutureContent(priceObj);
        }
      }) : <IndicesSkeleton />}
    </Carousel>
  );
};

export default MarketIndices;
