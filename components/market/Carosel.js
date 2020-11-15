import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

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
    <div>
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
    </div>
  );
};

export default Carousel;
