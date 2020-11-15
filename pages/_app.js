import "~/styles/global.scss";
import { LanguageProvider } from "~/context/LanguageContext";
import ThemeManager from "~/theme";

const App = ({ Component, pageProps }) => {
  return (
    <ThemeManager>
      <LanguageProvider lang={pageProps.localization?.locale}>
        <Component {...pageProps} />
      </LanguageProvider>
    </ThemeManager>
  );
};

export default App;
