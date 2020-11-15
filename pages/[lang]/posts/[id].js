import Head from "next/head";
import Layout from "~/components/layout";
import Date from "~/components/date";
import { getLocalizationProps } from "~/context/LanguageContext";
import { getAllPostIds, getPostData } from "~/lib/posts";
import utilStyles from "~/styles/utils.module.css";
import { locales } from '~/translations/config'

const Post = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
};

export async function getStaticPaths() {
  // Correct format
  // [
  //   { params: { lang: 'en', pid: 'i18n-ssg-nextjs-app' } },
  //   { params: { lang: 'fr', pid: 'i18n-ssg-nextjs-app' } }
  // ]
  
  const posts = getAllPostIds();
  const paths = posts.flatMap(post =>
    locales.flatMap((locale) =>
      Object.keys(post).map((postLang) => ({
        params: { lang: locale, id: post[postLang].id },
      }))
    )
  )
  return {
    paths,
    fallback: false,
  };
}
export async function getStaticProps(ctx) {
  // Fetch necessary data for the blog post using params.id
  const localization = getLocalizationProps(ctx);
  const postData = await getPostData(ctx.params.id);
  return {
    props: {
      postData,
      localization
    },
  };
}

export default React.memo(Post);
