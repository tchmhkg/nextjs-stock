import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import styled from "styled-components";

const Container = styled.div`
  height: 60px;
  @media (max-width: 768px) {
    height: 80px;
  }
`;

const responsive = {
  0: {
    items: 2,
  },
  768: {
    items: 3,
  },
};

const Carousel = ({ children }) => {
  return (
    <Container>
      <AliceCarousel
        mouseTracking
        autoPlay
        autoPlayInterval={800}
        infinite
        responsive={responsive}
        disableButtonsControls
        disableDotsControls
        autoPlayStrategy="none"
      >
        {children}
      </AliceCarousel>
    </Container>
  );
};

export default Carousel;
