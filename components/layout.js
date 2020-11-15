import Head from "next/head";
import Link from "next/link";
import styles from "~/components/layout.module.css";
import utilStyles from "~/styles/utils.module.css";
import useTranslation from '~/hooks/useTranslation'
import LanguageSwitcher from '~/components/LanguageSwitcher';

import BackButton from "~/components/back";

const name = "Truman";
export const siteTitle = "Next.js Sample Website";

const Layout = ({ children, home, showAvatar = true, back = false }) => {
  const { locale, t } = useTranslation()

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <LanguageSwitcher />  
      {showAvatar && (
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
          <Link href="/[lang]" as={`/${locale}`}>
              <a>
                <img
                  src="/images/profile.jpg"
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
      {back && <BackButton />}
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/[lang]" as={`/${locale}`}>
            <a>← {t('Back to home')}</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Layout;
