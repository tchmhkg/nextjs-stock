import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { locales, languageNames } from "~/translations/config";
import { LanguageContext } from "~/context/LanguageContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 374px) {
    display: none;
  }
`;

const LocaleButton = styled.div`
  cursor: pointer;
  color: ${(props) =>
    props.selected ? '#ffffff' : props.theme.text};
  display: flex;
  justify-content: center;
  margin: 0 5px;
  border-radius: 20px;
  padding: 5px 10px;
  background: ${({selected, theme}) =>
    selected ? theme.primary1 : 'transparent'};
  background: ${({selected, theme}) =>
    selected ? `-webkit-linear-gradient(to right, ${theme.primary2}, ${theme.primary1})` : 'transparent'};
  background: ${({selected, theme}) =>
    selected ? `linear-gradient(to right, ${theme.primary2}, ${theme.primary1})` : 'transparent'};
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
