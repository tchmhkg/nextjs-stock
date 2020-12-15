import Head from "next/head";
import Layout from "~/components/layout";
import { getLocalizationProps } from "~/context/LanguageContext";
import { getAllPostIds, getPostData } from "~/lib/posts";
import { locales } from '~/translations/config'
import Head from "~/components/post/post-detail";

const Post = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <PostDetail data={postData}/>
    </Layout>
  );
};

export async function getStaticPaths() {
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
