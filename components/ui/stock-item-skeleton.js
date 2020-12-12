import styled from 'styled-components';
import { memo } from 'react';
import { BlockSkeleton, CircleSkeleton } from './skeleton';

const SkeletonContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;
const SkeletonLeftWrapper = styled.div`
  display: flex;
  flex: 0.6;
  flex-direction: row;
  align-items: center;
`;

const SkeletonInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const SkeletonPriceWrapper = styled.div`
  display: flex;
  flex: 0.4;
  flex-direction: column;
  align-items: flex-end;
`;

const StockItemSkeleton = ({ ...props }) => (
  <SkeletonContainer>
    <SkeletonLeftWrapper>
      <CircleSkeleton />
      <SkeletonInfoWrapper>
        <BlockSkeleton size="xsmall" />
        <BlockSkeleton />
      </SkeletonInfoWrapper>
    </SkeletonLeftWrapper>
    <SkeletonPriceWrapper>
      <BlockSkeleton size="small" />
      <BlockSkeleton size="small" />
    </SkeletonPriceWrapper>
  </SkeletonContainer>
);

export default memo(StockItemSkeleton);
