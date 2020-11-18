import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Head from "next/head";
import styled from 'styled-components';

import { getLocalizationProps } from "~/context/LanguageContext";
import useTranslation from "~/hooks/useTranslation";

import Layout from "~/components/layout";
import NewsItem from "~/components/market/news-item";
import Bookmark from "~/components/market/bookmark";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Stock = ({news = [], symbol}) => {
  const { t } = useTranslation();

  return (
    <Layout showAvatar={false} back backUrl="/market">
      <Head>
        <title>{symbol}</title>
      </Head>
      <Header>
        <h2>{symbol}</h2>
        <Bookmark symbol={symbol}/>
      </Header>
      {`!! TODO: Display candlestick chart, historical data and company info`}
      <h3>{t("news")}</h3>
      {news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      ))}
    </Layout>
  );
};
export async function getServerSideProps(ctx) {
  const localization = getLocalizationProps(ctx);
  const { symbol } = ctx.query;
  const res = await axios.get(process.env.VERCEL_URL + "/api/market/news", {
    params: {
      symbol,
    },
  });
  const news = res?.data?.data;
  return {
    props: {
      localization,
      news,
      symbol,
    },
  }
}

export default React.memo(Stock);
