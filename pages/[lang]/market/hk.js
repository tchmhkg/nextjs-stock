import Head from "next/head";
import { getLocalizationProps } from "~/context/LanguageContext";

import Layout from "~/components/layout";
import HKIndices from "~/components/market/hk/indices";
// import USIndices from "~/components/market/us-indices";
import StockList from "~/components/market/stock-list";
// import Crypto from "~/components/market/crypto";
import useTranslation from "~/hooks/useTranslation";

const HKMarket = () => {
  const { t } = useTranslation();

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>{t('HK Market')}</title>
      </Head>
      HK Market
      <HKIndices />
      {/* <StockList /> */}
    </Layout>
  );
};

// export async function getServerSideProps(ctx) {
//   const localization = getLocalizationProps(ctx);
//   return {
//     props: {
//       localization,
//     },
//   }
// }

export default React.memo(HKMarket);
