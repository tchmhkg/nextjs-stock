import { memo } from 'react';
import styled from 'styled-components';

import LanguageSwitcher from '~/components/language-switcher';
import ThemeSwitcher from "~/components/theme-switcher";
// import Menu from "~/components/menu";
import { Menu } from "~/components/common/Menu";
import Image from 'next/image';

const Container = styled.div`
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 70px;
  background-color: ${props => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  z-index: 20;
  @media (min-width: 768px) {
    padding-right: 15px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const GitHubIconWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
`;

const Header = () => {
  return (
    <Container>
      <Menu />
      <RightWrapper>
        <GitHubIconWrapper>
          <a href="https://github.com/tchmhkg/nextjs-app" target="_blank">
            <Image 
              src="/images/github.png"
              width={30}
              height={30}
              alt="GitHub Icon"
            />
          </a>
        </GitHubIconWrapper>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </RightWrapper>
    </Container>
  )
}

export default memo(Header);