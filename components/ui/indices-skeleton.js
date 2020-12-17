import styled from 'styled-components';
import React, { memo } from 'react';
import { BlockSkeleton } from './skeleton';

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 0 15px;
  width: 120px;
  &:last-child {
    margin-right: 15px;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const IndexSkeleton = memo(({ ...props }) => (
  <SkeletonContainer>
    <BlockSkeleton size="xsmall" />
    <BlockSkeleton size="small" />
    <BlockSkeleton size="small" />
  </SkeletonContainer>
));

const IndicesSkeleton = () => (
  <List>{Array(6).fill().map((_, i) => <IndexSkeleton key={i}/>)}</List>
)

export default memo(IndicesSkeleton);
