import React, { memo, useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import useTranslation from '~/hooks/useTranslation';
import { getLocalizationProps } from '~/context/LanguageContext';
import { getLastAndClosePriceFromYahoo } from '~/utils';
import Layout from '~/components/layout';
import Spinner from '~/components/spinner';

const LatestPrice = dynamic(import('~/components/market/latest-price'));
const NewsList = dynamic(import('~/components/market/news-list'));
const Bookmark = dynamic(import('~/components/market/bookmark'));
const Charts = dynamic(import('~/components/market/charts'));

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Symbol = styled.span`
  font-size: 24px;
  font-weight: bold;
  display: inline-block;
`;

const Name = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.inactiveLegend};
`;

const SymbolNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DescWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  p {
    color: ${(props) => props.theme.text};
  }
`;

const StickyWrapper = styled(motion.div)`
  position: sticky;
  top: 70px;
  left: 0;
  background-color: ${(props) => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  padding: 5px 15px;
  margin: 0 -15px;
  z-index: 10;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderContainer = memo(({ symbol, name }) => {
  return (
    <Header>
      <SymbolNameWrapper>
        <Symbol>{symbol} </Symbol>
        {name && <Name>({name})</Name>}
      </SymbolNameWrapper>
    </Header>
  );
});

const CompanyDesc = memo(({ description = '' }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h3>{t('Company Info')}</h3>
      <DescWrapper>
        <p>{description}</p>
      </DescWrapper>
    </div>
  );
});

const Stock = ({ symbol, data = [] }) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const { lastPrice, closePrice } = getLastAndClosePriceFromYahoo(data);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!symbol) {
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
      <StickyWrapper layout layoutId={symbol}>
        <HeaderContainer symbol={symbol} name={data?.longName || stockInfo?.name} />
        <LatestPrice data={{lastPrice, closePrice}} symbol={symbol} isDelayed={data?.quoteSourceName === 'Delayed Quote'}/>
        <Bookmark symbol={symbol} />
      </StickyWrapper>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <CompanyDesc description={stockInfo?.description} />
          <Charts symbol={symbol} />
          <NewsList news={news} />
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const localization = getLocalizationProps(ctx);
  const { symbol } = ctx.query || '';
  const url = new URL(ctx.req.url, `http://${ctx.req.headers.host}`);
  try {
    const res = await axios.get(url.origin +'/api/market/quotes', {params: {symbol}})
    let data = [];

    if(res?.data?.success && res?.data?.data.length) {
      data = res?.data?.data?.[0]
    }

    return {
      props: {
        localization,
        symbol,
        data
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        localization,
        symbol,
      },
    };
  }
}

export default Stock;
