import React, { useCallback } from 'react';
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
  const renderSkeleton = useCallback(() => {
    let result = [];
    for(let i = 0; i < 5; i++) {
      result.push(<NewsItemSkeleton key={i}/>)
    }
    return result
  }, [])
  return (
    <>
      <Title>{t('news')}</Title>
      {!loading ? news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      )) : (<>
        {renderSkeleton()}
      </>)}
    </>
  );
};

export default React.memo(NewsList);
