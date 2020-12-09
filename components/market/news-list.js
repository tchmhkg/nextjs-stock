import React from 'react';
import dynamic from 'next/dynamic';
import useTranslation from '~/hooks/useTranslation';

const NewsItem = dynamic(import('~/components/market/news-item'));

const NewsList = ({ news }) => {
  const { t } = useTranslation();
  return (
    <>
      <h3>{t('news')}</h3>
      {news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      ))}
    </>
  );
};

export default React.memo(NewsList);
