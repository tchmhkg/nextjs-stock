import '~/styles/global.scss';
import "~/styles/chart.scss";
import { AnimateSharedLayout } from 'framer-motion';
import NProgress from 'nprogress';
import Router from 'next/router';

import { LanguageProvider } from '~/context/LanguageContext';
import ThemeManager from '~/theme';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({ Component, pageProps }) => {
  return (
    <AnimateSharedLayout>
      <ThemeManager>
        <LanguageProvider lang={pageProps.localization?.locale}>
          <Component {...pageProps} />
        </LanguageProvider>
      </ThemeManager>
    </AnimateSharedLayout>
  );
};

export default App;
