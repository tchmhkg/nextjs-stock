import { memo } from 'react';
import styled from 'styled-components';

import LanguageSwitcher from '~/components/language-switcher';
import ThemeSwitcher from "~/components/theme-switcher";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 70px;
  background-color: ${props => props.theme.primary};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Header = () => {
  return (
    <Container>
      <LanguageSwitcher />
      <ThemeSwitcher />
    </Container>
  )
}

export default memo(Header);