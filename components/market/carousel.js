import { memo } from 'react';
import Marquee from "react-marquee-slider";
import styled from "styled-components";

const Container = styled.div`
  height: 85px;
  position: sticky;
  top: 70px;
  background-color: ${props => props.theme.background};
  z-index: 10;
  margin: 0 -15px;
`;

const Carousel = ({ children }) => {
  return (
    <Container>
      <Marquee>
        {children}
      </Marquee>
    </Container>
  );
};

export default memo(Carousel);
