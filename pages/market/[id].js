import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import axios from 'axios';
import { useRouter } from 'next/router'

import Layout from "../../components/layout";
import NewsItem from '../../components/market/news-item';

const Stock = () => {
  const router = useRouter()
  const { id: ticker } = router.query
  const [news, setNews] = useState([]);

  useEffect(() => {
    // known issue: ticker will be lost after refresh
    if(!ticker) {
      return;
    }
    const getNews = async () => {
      const res = await axios.get('/api/market/news', { 
        params: {
          ticker
        }
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
      <h3>News</h3>
      {news?.map(item => (
        <NewsItem key={item.guid} item={item}/>
      ))}
    </Layout>
  );
};

// export async function getStaticPaths() {
//   // Return a list of possible value for id
//   const paths = getAllPostIds();
//   return {
//     paths,
//     fallback: false,
//   };
// }
// export async function getStaticProps({ params }) {
//   // Fetch necessary data for the blog post using params.id
//   const postData = await getPostData(params.id);
//   return {
//     props: {
//       postData,
//     },
//   };
// }

export default React.memo(Stock);
