import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import useTranslation from '~/hooks/useTranslation';

const Container = styled.div`
  flex: 1;
  padding: 5px 10px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;

const Name = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const SymbolWrapper = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

const Symbol = styled.span`
  font-size: 18px;
  display: inline-block;
  margin-right: 5px;
`;

const SuggestionItem = ({ item }) => {
  const { locale } = useTranslation();

  return (
    <Link
      href={`/[lang]/market/[symbol]`}
      as={`/${locale}/market/${item.ticker}`}
    >
      <Container>
        <SymbolWrapper>
          <Symbol>{item.ticker}</Symbol>
        </SymbolWrapper>
        <Name numberOfLines={1}>{item.name}</Name>
      </Container>
    </Link>
  );
};

export default React.memo(SuggestionItem);
