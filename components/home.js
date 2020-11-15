import Link from "next/link";
import utilStyles from "~/styles/utils.module.scss";
import useTranslation from "~/hooks/useTranslation";
import styled from 'styled-components';

const Heading = styled.h2`
  color: ${props => props.theme.text};
`;

const Home = ({ allPostsData = [] }) => {
  const { locale, t } = useTranslation();

  return (
  <div>
      <Link href="/[lang]/market" as={`/${locale}/market`}>{t('Click here to market list')}</Link>
      <br />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Heading className={utilStyles.headingLg}>{t('Articles')}</Heading>
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

