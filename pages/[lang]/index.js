import Layout from "~/components/layout";
import { getSortedPostsData } from "~/lib/posts";
import { getLocalizationProps } from "~/context/LanguageContext";
import {locales} from '~/translations/config';

import Home from "~/components/home";
import { useTheme } from "~/theme";

const IndexPage = ({ allPostsData = [] }) => {
  const theme = useTheme();
  // console.log(theme);
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
  paths: locales.map((lang) => ({ params: { lang } })),
  fallback: false,
});

export default IndexPage;
