import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import styles from "~/components/layout.module.scss";
import useTranslation from '~/hooks/useTranslation'

const Head = dynamic(import('~/components/head'));
const Navbar = dynamic(import('~/components/navbar'));
const BackButton = dynamic(import('~/components/back'));
const Image = dynamic(import('next/image'));
const Link = dynamic(import('next/link'));

export const name = "Truman";

const Container = styled.div`
  min-height: calc(100vh - 70px);
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
              className={`${styles.headerHomeImage} ${styles.borderCircle}`}
              alt={name}
            />
            <h1 className={styles.headingXl}>{name}</h1>
          </>
        ) : (
          <>
          <Link href="/[lang]" as={`/${locale}`}>
              <a>
                <Image
                  src="/images/profile.png"
                  width={70}
                  height={87.5}
                  className={`${styles.headerImage} ${styles.borderCircle}`}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className={styles.headingLg}>
              <Link href="/[lang]" as={`/${locale}`}>
                <a className={styles.colorInherit}>{name}</a>
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
