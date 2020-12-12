import styled from 'styled-components';
import { memo } from 'react';
import { BlockSkeleton } from './skeleton';

const SkeletonContainer = styled(BlockSkeleton)`
  width: 100%;
  height: 300px;
`;

export const ChartSkeleton = memo(({ ...props }) => (
  <SkeletonContainer />
));

export default memo(ChartSkeleton);
