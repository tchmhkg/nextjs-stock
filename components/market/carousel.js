import { memo } from 'react';
import Marquee from "react-marquee-slider";
import styled from "styled-components";

const Container = styled.div`
  height: 85px;
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
