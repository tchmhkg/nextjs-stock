import Head from "next/head";

import Layout from "~/components/layout";
import HKIndices from "~/components/market/hk/indices";
import useTranslation from "~/hooks/useTranslation";

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
