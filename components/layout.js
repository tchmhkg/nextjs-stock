import Link from "next/link";
import Image from "next/image";
import styled from 'styled-components';
import styles from "~/components/layout.module.scss";
import utilStyles from "~/styles/utils.module.scss";
import useTranslation from '~/hooks/useTranslation'

import Head from "~/components/head";
import Navbar from "~/components/navbar";
import BackButton from "~/components/back";

export const name = "Truman";

const Container = styled.div`
  min-height: calc(100vh - 70px);
  min-height: -webkit-calc(100vh - 70px);
  min-height: -moz-calc(100vh - 70px);
  min-height: -ms-calc(100vh - 70px);
  min-height: -o-calc(100vh - 70px);
  top: 70px;
  padding: 15px;
  position: relative;
  color: ${props => props.theme.text};
  a {
    color: ${props => props.theme.text};
  };
`;

const Layout = ({ children, home, showAvatar = true, back = false, showBackToHome = true, ...props }) => {
  const { locale, t } = useTranslation();

  return (
    <>
    <Navbar />
    <Container>
      <Head />
      {showAvatar && (
      <header className={styles.header}>
        {home ? (
          <>
            <Image
              src="/images/profile.png"
              width={100}
              height={125}
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.headingXl}>{name}</h1>
          </>
        ) : (
          <>
          <Link href="/[lang]" as={`/${locale}`}>
              <a>
                <Image
                  src="/images/profile.png"
                  width={70}
                  height={87.5}
                  className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/[lang]" as={`/${locale}`}>
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      )}
      {back && <BackButton backUrl={props.backUrl}/>}
      <main>{children}</main>
      {(!home && showBackToHome) && (
        <div className={styles.backToHome}>
          <Link href="/[lang]" as={`/${locale}`}>
            <a>← {t('Back to home')}</a>
          </Link>
        </div>
      )}
    </Container>
    </>
  );
};

export default Layout;
