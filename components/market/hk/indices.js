import React, { useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

import useTranslation from '~/hooks/useTranslation';
import { getLastClosePriceFromHtml } from '~/utils';

const Carousel = dynamic(import('~/components/market/carousel'));
const IndexPrice = dynamic(import('~/components/market-indices/index-price'));
const IndicesSkeleton = dynamic(import('~/components/ui/indices-skeleton'));

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

const fetcher = (url, params) => axios.get(url, {params}).then(res => res.data?.data);

const HKIndices = () => {
  const params = useMemo(() => ({market: 'HK'}), []);
  const { data: prices, error } = useSWR(['/api/market/market-indices', params], fetcher, {refreshInterval: 2000, refreshWhenHidden: false})

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
        )
      }) : <IndicesSkeleton />}
    </Carousel>
  );
};

export default HKIndices;
