import React, { memo, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styled from 'styled-components';

import { getLocalizationProps } from '~/context/LanguageContext';
import useTranslation from '~/hooks/useTranslation';

import Layout from '~/components/layout';
import Spinner from '~/components/spinner';

const LatestPrice = dynamic({
  loader: () => import('~/components/market/latest-price'),
});

const NewsList = dynamic({
  loader: () => import('~/components/market/news-list'),
});

const Bookmark = dynamic({
  loader: () => import('~/components/market/bookmark'),
});

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Symbol = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const Name = styled.span`
  font-size: 18px;
`;

const DescWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  p {
    color: ${(props) => props.theme.text};
  }
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: 70px;
  background-color: ${(props) => props.theme.background};
  padding: 5px 0;
`;

const HeaderContainer = memo(({ symbol, name }) => {
  return (
    <Header>
      <div>
        <Symbol>{symbol} </Symbol>
        <Name>({name})</Name>
      </div>
      <Bookmark symbol={symbol} />
    </Header>
  );
});

const CompanyDesc = memo(({ description = '' }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h3>{t('Company Info')}</h3>
      <DescWrapper><p>{description}</p></DescWrapper>
    </div>
  );
});

const Stock = ({ symbol }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [closePrice, setClosePrice] = useState(0);

  useLayoutEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('/api/market/stockInfo', {
          params: {
            symbol,
          },
        });
        const newsData = res?.data?.feeds;
        const stockInfoData = res?.data?.metaInfo;
        const closePriceData = res?.data?.latestPrice?.[0]?.adjClose;
        setNews(newsData);
        setStockInfo(stockInfoData);
        setClosePrice(closePriceData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getData();
  }, [symbol]);

  if (loading) {
    return (
      <Layout showAvatar={false} showBackToHome={false}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout showAvatar={false} back backUrl="/market">
      <Head>
        <title>{symbol}</title>
      </Head>
      <StickyWrapper>
        <HeaderContainer symbol={symbol} name={stockInfo?.name} />
        <LatestPrice symbol={symbol} closePrice={closePrice} />
      </StickyWrapper>
      <CompanyDesc description={stockInfo?.description} />
      {/* <CandleStickChart symbol={symbol}/>
      {`!! TODO: Display candlestick chart, historical data`} */}
      <NewsList news={news} />
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const localization = getLocalizationProps(ctx);
  const { symbol } = ctx.query;
  return {
    props: {
      localization,
      symbol,
    },
  };
}

export default Stock;
