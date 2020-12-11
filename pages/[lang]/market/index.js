import Head from "next/head";

import Layout from "~/components/layout";
import MarketIndices from "~/components/market/indices";
import StockList from "~/components/market/stock-list";
import useTranslation from "~/hooks/useTranslation";

const Market = () => {
  const { t } = useTranslation();

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>{t('US Market')}</title>
      </Head>
      <MarketIndices />
      <StockList />
    </Layout>
  );
};


export default React.memo(Market);
