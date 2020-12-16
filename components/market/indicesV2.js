import { useCallback, memo, useMemo } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import useSWR from 'swr';
import useTranslation from '~/hooks/useTranslation';
import { getPricesFromHtml } from '~/utils';

const Carousel = dynamic(import('~/components/market/carousel'));
const IndexPrice = dynamic(import('~/components/market-indices/index-price'));
const IndicesSkeleton = dynamic(import('~/components/ui/indices-skeleton'));

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
  const params = useMemo(() => ({market: 'US'}), []);
  const { data: prices, error } = useSWR(['/api/market/market-indices', params], fetcher, {refreshInterval: 2000, refreshWhenHidden: false})

  const renderQuoteContent = useCallback(data => {
    const priceObj = getPricesFromHtml(data?.html);

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
