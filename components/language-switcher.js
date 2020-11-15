import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { locales, languageNames } from "~/translations/config";
import { LanguageContext } from "~/context/LanguageContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LocaleButton = styled.div`
  cursor: pointer;
  color: ${(props) =>
    props.selected ? props.theme.primary : '#ECEFF4'};
  display: flex;
  justify-content: center;
  margin: 0 5px;
  border-radius: 20px;
  padding: 5px;
  background-color: ${(props) =>
    props.selected ? '#ECEFF4' : 'transparent'};
`;

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale: currentLocale } = React.useContext(LanguageContext);

  const handleLocaleChange = React.useCallback(
    (locale) => {
      const regex = new RegExp(`^/(${locales.join("|")})`);
      router.push(router.pathname, router.asPath.replace(regex, `/${locale}`));
    },
    [router]
  );

  return (
    <Wrapper>
      {locales.map((locale) => (
        <LocaleButton
          key={locale}
          selected={locale === currentLocale}
          onClick={() => handleLocaleChange(locale)}
        >
          {languageNames[locale]}
        </LocaleButton>
      ))}
    </Wrapper>
  );
};

export default React.memo(LanguageSwitcher);
