import Head from "next/head";
import { getLocalizationProps } from "~/context/LanguageContext";

import Layout from "~/components/layout";
import MarketIndices from "~/components/market/indices";
// import USIndices from "~/components/market/us-indices";
import StockList from "~/components/market/stock-list";
// import Crypto from "~/components/market/crypto";
import useTranslation from "~/hooks/useTranslation";

const Market = () => {
  const { t } = useTranslation();

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>{t('US Market')}</title>
      </Head>
      <MarketIndices />
      {/* <USIndices /> */}
      <hr />
      {/* <Crypto /> */}
      <StockList />
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const localization = getLocalizationProps(ctx);
  return {
    props: {
      localization,
    },
  }
}

export default React.memo(Market);
