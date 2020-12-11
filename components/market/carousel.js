import { memo } from 'react';
import styled from "styled-components";

const Container = styled.div`
  height: 85px;
  position: sticky;
  top: 70px;
  background-color: ${props => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  z-index: 10;
  margin: 0 -15px;
`;

const Wrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
  display: flex;
  align-items: center;
  -ms-overflow-style: none;
  scrollbar-width: none;
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
