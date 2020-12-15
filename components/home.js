import Link from 'next/link';
import styles from '~/components/home.module.scss';
import useTranslation from '~/hooks/useTranslation';
import styled from 'styled-components';

const Heading = styled.h2`
  color: ${(props) => props.theme.text};
`;

const Home = ({ allPostsData = [] }) => {
  const { locale, t } = useTranslation();

  return (
    <div>
      <Link href="/[lang]/market" as={`/${locale}/market`}>
        {t('Click here to market list')}
      </Link>
      <br />
      <section className={`${styles.headingMd} ${styles.padding1px}`}>
        <Heading className={styles.headingLg}>{t('Articles')}</Heading>
        <ul className={styles.list}>
          {allPostsData.map(({ id, title, date }) => (
            <li className={styles.listItem} key={id}>
              <Link href={`/[lang]/posts/${id}`} as={`/${locale}/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={styles.lightText}>{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
export default React.memo(Home);
