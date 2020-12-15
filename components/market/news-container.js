import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const NewsList = dynamic(import('~/components/market/news-list'));

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0;
`;

const NewsContainer = ({ symbol }) => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!symbol) {
          return;
        }
        setLoading(true);
        const res = await axios.get('/api/market/news', {
          params: {
            symbol,
          },
        });
        const newsData = res?.data?.feeds;
        setNews(newsData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getData();
  }, [symbol]);

  return (
    <>
      <Title>{t('news')}</Title>
      <NewsList loading={loading} news={news} />
    </>
  );
};

export default React.memo(NewsContainer);
