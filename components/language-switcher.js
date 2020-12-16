import { useRouter } from "next/router";
import styled from "styled-components";
import { locales, languageNames } from "~/translations/config";
import { LanguageContext } from "~/context/LanguageContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 374px) {
    display: ${({inNavbar}) => inNavbar ? 'none' : 'flex'};
  }
  @media (min-width: 375px) {
    display: ${({inNavbar}) => inNavbar ? 'flex' : 'none'};
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

const LanguageSwitcher = ({inNavbar = false}) => {
  const router = useRouter();
  const { locale: currentLocale } = React.useContext(LanguageContext);

  const handleLocaleChange = React.useCallback(
    (locale) => {
      if(currentLocale === locale) return;
      const regex = new RegExp(`^/(${locales.join("|")})`);
      router.push(router.pathname, router.asPath.replace(regex, `/${locale}`));
    },
    [router, currentLocale]
  );

  return (
    <Wrapper inNavbar={inNavbar}>
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
