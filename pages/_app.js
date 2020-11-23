import 'nprogress/nprogress.css';
import '~/styles/global.scss';
import dynamic from 'next/dynamic';
import { LanguageProvider } from '~/context/LanguageContext';
import ThemeManager from '~/theme';

const TopProgressBar = dynamic(
  () => {
    return import('~/components/top-progress-bar');
  },
  { ssr: false }
);

const App = ({ Component, pageProps }) => {
  return (
    <>
      <TopProgressBar />
      <ThemeManager>
        <LanguageProvider lang={pageProps.localization?.locale}>
          <Component {...pageProps} />
        </LanguageProvider>
      </ThemeManager>
    </>
  );
};

export default App;
