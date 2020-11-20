import { memo } from 'react';
import styled from 'styled-components';

import LanguageSwitcher from '~/components/language-switcher';
import ThemeSwitcher from "~/components/theme-switcher";
import Menu from "~/components/menu";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background-color: ${props => props.theme.primary};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = () => {
  return (
    <Container>
      <Menu />
      <RightWrapper>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </RightWrapper>
    </Container>
  )
}

export default memo(Header);