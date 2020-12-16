import { memo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: #f2f2f2;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 100%;
    background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);
    animation: loading 2s infinite linear;
  }
  @keyframes loading {
    0% {
      transform: translateX(0);
    }
    50%,
    100% {
      transform: translateX(460px);
    }
  }
  margin: 5px 0;
`;

const BlockContainer = styled(Container)`
  width: ${({ size }) => getBlockWidth(size)};
  height: 15px;
`;

const CircleContainer = styled(Container)`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

const getBlockWidth = (size) => {
  switch (size) {
    case 'xsmall':
      return '50px';
    case 'small':
      return '100px';
    case 'medium':
      return '150px';
    case 'large':
      return '200px';
    case 'xlarge':
      return '250px';
    case 'full':
      return '100%';
    default:
      return '150px';
  }
};

export const BlockSkeleton = memo(({ size = 'medium', ...props }) => (
  <BlockContainer size={size} {...props} />
));

export const CircleSkeleton = memo(({ ...props }) => (
  <CircleContainer {...props} />
));
