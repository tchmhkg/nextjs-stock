import Head from "next/head";
import useSWR from 'swr'

import Layout from '../../components/layout'
import utilStyles from "../../styles/utils.module.css";
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Tech() {
    const { data, error } = useSWR('https://newsapi.org/v2/top-headlines?country=hk&category=technology&apiKey=608bf565c67f4d99994c08d74db82f54', fetcher);

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
  return (
    <Layout>
      <Head>
        <title>Tech News</title>
      </Head>
      <h1>Tech</h1>
      <ul className={utilStyles.list}>
          {data.articles.map(({ title, url, description }, index) => (
            <li className={utilStyles.listItem} key={`${title}_${index}`}>
              <h4>{title}</h4>
              <p>{description}</p>
              <a href={url} target="_blank">{url}</a>
            </li>
          ))}
      </ul>
    </Layout>
  );
}
