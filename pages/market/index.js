import Head from "next/head";
// import useSWR from "swr";

import Layout from "~/components/layout";
// import utilStyles from "~/styles/utils.module.css";
import MarketIndices from '~/components/market/indices';
import StockList from "~/components/market/stock-list";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Market = () => {
  // const { data, error } = useSWR(
  //   "https://newsapi.org/v2/top-headlines?country=hk&category=technology&apiKey=ea895a2c55974e828916ed2c2aab1fc5",
  //   fetcher
  // );

  // if (error) return <div>failed to load</div>;
  // if (!data) return <div>loading...</div>;

  return (
    <Layout showAvatar={false}>
      <Head>
        <title>US Market</title>
      </Head>
      <MarketIndices />
      <hr />
      <StockList />
    </Layout>
  );
};

export default Market;
