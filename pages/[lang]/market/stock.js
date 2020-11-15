import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { getLocalizationProps } from "~/context/LanguageContext";
import useTranslation from "~/hooks/useTranslation";

import Layout from "~/components/layout";
import NewsItem from "~/components/market/news-item";

const Stock = () => {
  const { locale, t } = useTranslation();
  const router = useRouter();
  const { id: ticker } = router.query;
  const [news, setNews] = useState([]);

  useEffect(() => {
    // known issue: ticker will be lost after refresh
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
  }, []);

  return (
    <Layout showAvatar={false} back>
      <Head>
        <title>{ticker}</title>
      </Head>
      {ticker}
      <h3>{t('news')}</h3>
      {news?.map((item) => (
        <NewsItem key={item.guid} item={item} />
      ))}
    </Layout>
  );
};

export const getStaticProps = async ({ ...ctx }) => {
  const localization = getLocalizationProps(ctx);
  console.log('props ctx ->',ctx)

  return {
    props: {
      localization,
    },
  };
};

export const getStaticPaths = async (ctx) => {
  console.log('ctx ->',ctx);
  return {
    paths: ["en", "zh"].map((lang) => ({ params: { lang } })),
    fallback: false,
  };
};

export default React.memo(Stock);
