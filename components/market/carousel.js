import { memo } from 'react';
import styled from "styled-components";

const Container = styled.div`
  height: 85px;
  position: sticky;
  position: -webkit-sticky;
  top: 70px;
  bottom: 0;
  background-color: ${props => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  z-index: 10;
  margin: 0 -15px;
  overflow-x: auto;
  transform: translate3d(0,0,0);

`;

const Wrapper = styled.div`
  overflow-x: auto;
  display: flex;
  align-items: center;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Carousel = ({ children }) => {
  return (
    <Container>
      <Wrapper>
        {children}
      </Wrapper>
    </Container>
  );
};

export default memo(Carousel);
