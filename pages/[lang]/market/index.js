import React from 'react';
import Head from "next/head";

import dynamic from 'next/dynamic';
import Layout from "~/components/layout";
import useTranslation from "~/hooks/useTranslation";

const MarketIndices = dynamic(import('~/components/market/indicesV2'));
const StockList = dynamic(import('~/components/market/stock-list'));
const Market = () => {
  const { t } = useTranslation();

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>{t('US Market')}</title>
      </Head>
      <MarketIndices />
      <hr />
      <StockList />
    </Layout>
  );
};


export default React.memo(Market);
