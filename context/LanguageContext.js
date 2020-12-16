import {useEffect, createContext, useState} from 'react'
import { useRouter } from 'next/router'
import { isLocale } from '~/translations/types'

export const LanguageContext = createContext({
  locale: 'en',
  setLocale: () => null
})

export const LanguageProvider = ({ lang = 'en', children }) => {
  const [locale, setLocale] = useState(lang)
  const { query } = useRouter()

  useEffect(() => {
    if (locale !== window.localStorage.getItem('locale')) {
      window.localStorage.setItem('locale', locale)
    }
  }, [locale])

  useEffect(() => {
    if (typeof query.lang === 'string' && isLocale(query.lang) && locale !== query.lang) {
      setLocale(query.lang)
    }
  }, [query.lang, locale])

  return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
}

export const getLocalizationProps = ctx => {
  return {
    locale: ctx.params?.lang || 'en',
  }
}