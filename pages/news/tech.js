import Head from "next/head";
import useSWR from "swr";

import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Tech = () => {
  const { data, error } = useSWR(
    "https://newsapi.org/v2/top-headlines?country=hk&category=technology&apiKey=ea895a2c55974e828916ed2c2aab1fc5",
    fetcher
  );

  if (error) return <Layout>failed to load</Layout>;
  if (!data) return <Layout>loading...</Layout>;

  return (
    <Layout>
      <Head>
        <title>Tech News</title>
      </Head>
      <h1>Tech</h1>
      <ul className={utilStyles.list}>
        {data?.articles?.map(({ title, url, description }, index) => (
          <li className={utilStyles.listItem} key={`${title}_${index}`}>
            <h4>{title}</h4>
            <p>{description}</p>
            <a href={url} target="_blank">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Tech;
