import React, { memo, useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import axios from 'axios';
import styled from 'styled-components';
import { motion } from "framer-motion";
import useTranslation from '~/hooks/useTranslation';

import Layout from '~/components/layout';
import Spinner from '~/components/spinner';
import CandleStickChart from '~/components/market/candlestick-chart';

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

const Symbol = styled(motion.span)`
  font-size: 24px;
  font-weight: bold;
  display: inline-block;
`;

const Name = styled.span`
  font-size: 18px;
`;

const SymbolNameWrapper = styled.div`
  display: flex;
  align-items: center;
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
      <SymbolNameWrapper>
        <Symbol layoutId={symbol}>{symbol} </Symbol>
        {name && <Name>({name})</Name>}
      </SymbolNameWrapper>
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

const Stock = () => {
  const router = useRouter();
  const {symbol} = router.query;
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        if(!symbol) {
          return;
        }
        const res = await axios.get('/api/market/stockInfo', {
          params: {
            symbol,
          },
        });
        const newsData = res?.data?.feeds;
        const stockInfoData = res?.data?.metaInfo;
        setLoading(false);
        setNews(newsData);
        setStockInfo(stockInfoData);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getData();
  }, [symbol]);

  return (
    <Layout showAvatar={false} back backUrl="/market">
      <Head>
        <title>{symbol}</title>
      </Head>
      <StickyWrapper>
        <HeaderContainer symbol={symbol} name={stockInfo?.name} />
        <LatestPrice symbol={symbol} />
      </StickyWrapper>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <CompanyDesc description={stockInfo?.description} />
          <CandleStickChart symbol={symbol}/>
          {/* {`!! TODO: Display candlestick chart, historical data`} */}
          <NewsList news={news} />
        </>
      )}
    </Layout>
  );
};

export default Stock;
