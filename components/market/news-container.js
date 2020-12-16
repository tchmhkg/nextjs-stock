import { useMemo } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const NewsList = dynamic(import('~/components/market/news-list'));

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0;
`;

const fetcher = (url, params) => axios.get(url, {params}).then(res => res?.data?.feeds);

const NewsContainer = ({ symbol }) => {
  const { t } = useTranslation();
  const params = useMemo(() => ({symbol}), [symbol]);
  const { data: news, error } = useSWR([symbol ? '/api/market/news' : null, params], fetcher);

  return (
    <>
      <Title>{t('news')}</Title>
      <NewsList news={news} />
    </>
  );
};

export default React.memo(NewsContainer);
