import '~/styles/global.css'
import { LanguageProvider } from '~/context/LanguageContext'

const App = ({ Component, pageProps }) => {
  console.log('pageProps => ',pageProps);
  return (
    <LanguageProvider lang={pageProps.localization?.locale}>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

export default App;