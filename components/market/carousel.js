import { memo } from 'react';
import styled from "styled-components";

const Container = styled.div`
  height: 85px;
  position: sticky;
  position: -webkit-sticky;
  top: 70px;
  background-color: ${props => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  z-index: 10;
  margin: 0 -15px;
  overflow: hidden;
  ${'' /* overflow-x: auto; */}
  transform: translate3d(0,0,0);

`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
  position: relative;
  ${'' /* -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  } */}
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
