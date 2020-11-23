import Head from "next/head";
// import useSWR from "swr";
import { getLocalizationProps } from "~/context/LanguageContext";

import Layout from "~/components/layout";
import MarketIndices from "~/components/market/indices";
import StockList from "~/components/market/stock-list";
// import Crypto from "~/components/market/crypto";
import useTranslation from "~/hooks/useTranslation";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Market = () => {
  const { t } = useTranslation();
  // const { data, error } = useSWR(
  //   "https://newsapi.org/v2/top-headlines?country=hk&category=technology&apiKey=ea895a2c55974e828916ed2c2aab1fc5",
  //   fetcher
  // );

  // if (error) return <div>failed to load</div>;
  // if (!data) return <div>loading...</div>;

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>{t('US Market')}</title>
      </Head>
      <MarketIndices />
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
