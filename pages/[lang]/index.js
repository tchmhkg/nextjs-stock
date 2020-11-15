import Layout from "~/components/layout";
import { getSortedPostsData } from "~/lib/posts";
import { getLocalizationProps } from "~/context/LanguageContext";

import Home from "~/components/home";

const IndexPage = ({ allPostsData = [] }) => {
  return (
    <Layout home>
      <Home allPostsData={allPostsData} />
    </Layout>
  );
};

export const getStaticProps = async (ctx) => {
  const allPostsData = getSortedPostsData();
  const localization = getLocalizationProps(ctx);

  return {
    props: {
      allPostsData,
      localization,
    },
  };
};

export const getStaticPaths = async () => ({
  paths: ["en", "zh"].map((lang) => ({ params: { lang } })),
  fallback: false,
});

export default IndexPage;
