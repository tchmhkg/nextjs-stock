import Head from "next/head";
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from '../lib/posts'

export default function Home({allPostsData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Link href="/news/tech">Click here for Technology news</Link>
      {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>News</h2>
        <ul className={utilStyles.list}>
          {articles.map(({ title, url, description }) => (
            <li className={utilStyles.listItem} key={title}>
              <h4>{title}</h4>
              <p>{description}</p>
              <a href={url} target="_blank">{url}</a>
            </li>
          ))}
        </ul>
      </section> */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>News</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, title, date }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
              {date}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
// This gets called on every request
// export async function getServerSideProps() {
//   // Fetch data from external API
//   const res = await fetch(`http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ea895a2c55974e828916ed2c2aab1fc5`)
//   const data = await res.json()

//   // Pass data to the page via props
//   return { props: { articles: data.articles } }
// }