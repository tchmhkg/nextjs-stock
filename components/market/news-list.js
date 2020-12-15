import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import NewsItemSkeleton from '~/components/ui/news-item-skeleton';

const NewsItem = dynamic(import('~/components/market/news-item'));

const NewsList = ({ loading, news }) => {
  const renderSkeleton = useCallback(() => {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(<NewsItemSkeleton key={i} />);
    }
    return result;
  }, []);
  return news ? (
    <>
      {news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      ))}
    </>
  ) : (
    <>{renderSkeleton()}</>
  );
};

export default React.memo(NewsList);
