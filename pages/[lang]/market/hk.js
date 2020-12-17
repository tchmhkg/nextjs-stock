import React from 'react';
import Head from "next/head";

import dynamic from 'next/dynamic';
import Layout from "~/components/layout";
import useTranslation from "~/hooks/useTranslation";

const HKIndices = dynamic(import('~/components/market/hk/indices'));

const HKMarket = () => {
  const { t } = useTranslation();

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>{t('HK Market')}</title>
      </Head>
      <HKIndices />
      {/* <StockList /> */}
    </Layout>
  );
};
export default React.memo(HKMarket);
