import Link from "next/link";
import utilStyles from "~/styles/utils.module.css";
import useTranslation from "~/hooks/useTranslation";

const Home = ({ allPostsData = [] }) => {
  const { locale, t } = useTranslation();

  return (
  <div>
      <Link href="/[lang]/market" as={`/${locale}/market`}>Click here for Market</Link>
      <br />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>{t('news')}</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, title, date }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/[lang]/posts/${id}`} as={`/${locale}/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
export default Home

