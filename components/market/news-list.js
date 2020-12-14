import React from 'react';
import dynamic from 'next/dynamic';
import useTranslation from '~/hooks/useTranslation';
import styled from 'styled-components';
import NewsItemSkeleton from '~/components/ui/news-item-skeleton';

const NewsItem = dynamic(import('~/components/market/news-item'));


const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0;
`;

const NewsList = ({ loading, news }) => {
  const { t } = useTranslation();
  return (
    <>
      <Title>{t('news')}</Title>
      {!loading ? news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      )) : (<>
        {Array(5).fill().map((_, i) => <NewsItemSkeleton key={i}/>)}
      </>)}
    </>
  );
};

export default React.memo(NewsList);
