import styled from 'styled-components';
import React, { memo } from 'react';
import { BlockSkeleton } from './skeleton';

const SkeletonContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  flex-direction: column;
  justify-content: space-between;
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;

const PublicDate = styled(BlockSkeleton)`
    margin-top: 10px;
`;

const NewsItemSkeleton = ({ ...props }) => (
  <SkeletonContainer>
    <BlockSkeleton size="full" />
    <PublicDate size="xlarge"/>
  </SkeletonContainer>
);

export default memo(NewsItemSkeleton);
