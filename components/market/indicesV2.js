import React, { useCallback, memo, useMemo } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import useSWR from 'swr';
import useTranslation from '~/hooks/useTranslation';
import IndexPrice from '~/components/market-indices/index-price';
import Carousel from '~/components/market/carousel';
import { usePageVisibility } from '~/hooks/usePageVisibility';
import IndicesSkeleton from '~/components/ui/indices-skeleton';
import { getLastClosePriceFromHtml } from '~/utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 0 15px;
  min-width: 125px;
  max-width: 125px;
  &:last-child {
    margin-right: 15px;
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

const fetcher = (url, params) => axios.get(url, {params}).then(res => res.data?.data);

const MarketIndices = () => {
  const isVisible = usePageVisibility();
  const params = useMemo(() => ({market: 'US'}), []);
  const { data: prices, error } = useSWR([isVisible ? '/api/market/market-indices' : null, params], fetcher, {refreshInterval: 2000})

  const renderQuoteContent = useCallback(data => {
    const priceObj = {
      lastPrice: data?.data?.last_value,
      closePrice: getLastClosePriceFromHtml(data?.data?.last_value, data?.html),
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
