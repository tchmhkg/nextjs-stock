import { useContext } from "react";
import { LanguageContext } from "~/context/LanguageContext";
import strings from "~/translations/strings";
import { defaultLocale } from "~/translations/config";

export default function useTranslation() {
  const { locale } = useContext(LanguageContext);

  function t(key) {
    if (!strings?.[locale]?.[key]) {
      console.warn(`Translation '${key}' for locale '${locale}' not found.`);
    }
    return strings?.[locale]?.[key] || strings?.[defaultLocale]?.[key] || key;
  }

  return {
    t,
    locale,
  };
}
