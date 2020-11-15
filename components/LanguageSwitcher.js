import React from "react";
import { useRouter } from "next/router";
import { locales, languageNames } from "~/translations/config";
import { LanguageContext } from "~/context/LanguageContext";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale } = React.useContext(LanguageContext);

  const handleLocaleChange = React.useCallback(
    (e) => {
      const targetLang = e.target.value;
      const regex = new RegExp(`^/(${locales.join("|")})`);
      router.push(
        router.pathname,
        router.asPath.replace(regex, `/${targetLang}`)
      );
    },
    [router]
  );

  return (
    <select value={locale} onChange={handleLocaleChange}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {languageNames[locale]}
        </option>
      ))}
    </select>
  );
};

export default React.memo(LanguageSwitcher);
