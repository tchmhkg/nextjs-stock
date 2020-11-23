import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styled from 'styled-components';

import { getLocalizationProps } from '~/context/LanguageContext';
import useTranslation from '~/hooks/useTranslation';

import Layout from '~/components/layout';
import NewsItem from '~/components/market/news-item';
import Bookmark from '~/components/market/bookmark';
// import CandleStickChart from "~/components/market/candlestick-chart";
import LatestPrice from '~/components/market/latest-price';

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
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: 0;
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
      <DescWrapper>{description}</DescWrapper>
    </div>
  );
});

const Stock = ({ symbol }) => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [closePrice, setClosePrice] = useState(0);

  useEffect(() => {
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
      } catch (err) {
        console.log(err);
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
        <LatestPrice symbol={symbol} closePrice={closePrice} />
      </StickyWrapper>
      <CompanyDesc description={stockInfo?.description} />
      {/* <CandleStickChart symbol={symbol}/>
      {`!! TODO: Display candlestick chart, historical data`} */}
      <h3>{t('news')}</h3>
      {news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      ))}
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

export default React.memo(Stock);
