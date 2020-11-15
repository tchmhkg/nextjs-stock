import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import queryString from "query-string";
import Head from "next/head";
import { useRouter } from "next/router";

import { getLocalizationProps } from "~/context/LanguageContext";
import {locales} from '~/translations/config';
import useTranslation from "~/hooks/useTranslation";

import Layout from "~/components/layout";
import NewsItem from "~/components/market/news-item";

const Stock = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    const queryFromUrl = queryString.parseUrl(router.asPath);
    if (id) {
      setTicker(id);
    } else if (queryFromUrl?.query?.id) {
      setTicker(queryFromUrl?.query?.id);
    }
  }, []);

  useEffect(() => {
    if (!ticker) {
      return;
    }
    const getNews = async () => {
      const res = await axios.get("/api/market/news", {
        params: {
          ticker,
        },
      });
      const news = res?.data?.data;
      setNews(news);
    };
    getNews();
  }, [ticker]);

  return (
    <Layout showAvatar={false} back backUrl="/market">
      <Head>
        <title>{ticker}</title>
      </Head>
      {ticker}
      <h3>{t("news")}</h3>
      {news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      ))}
    </Layout>
  );
};

export const getStaticProps = async ({ ...ctx }) => {
  const localization = getLocalizationProps(ctx);

  return {
    props: {
      localization,
    },
  };
};

export const getStaticPaths = async (ctx) => {
  return {
    paths: locales.map((lang) => ({ params: { lang } })),
    fallback: false,
  };
};

export default React.memo(Stock);
