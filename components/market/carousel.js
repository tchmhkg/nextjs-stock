import { memo } from 'react';
import styled from "styled-components";
import { motion } from 'framer-motion';

const Container = styled.div`
  height: 85px;
  width: 100%;
  ${'' /* position: sticky; */}
  ${'' /* position: -webkit-sticky; */}
  position: fixed;
  top: 70px;
  bottom: 1px;
  background-color: ${props => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  z-index: 10;
  margin: 0 -15px;
  ${'' /* overflow: hidden; */}
  overflow-x: auto;
  transform: translate3d(0,0,0);
  display: block;
  
`;

const Wrapper = styled(motion.div)`
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
  // return (
  //   // <Container>
  //   <DragSlider>
  //   {[...Array(24).keys()].map((item, key) => (
  //     <FlexItem key={key} width={rand()}>
  //       {item + 1}
  //     </FlexItem>
  //   ))}
  // </DragSlider>
  // // </Container>
  // )
  return (
    <Container>
      <Wrapper  onPan={(e, pointInfo) => {console.log(e, pointInfo)}}>
        {children}
      </Wrapper>
    </Container>
  );
};

export default memo(Carousel);

function rand(min = 200, max = 500) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}