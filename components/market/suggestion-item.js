import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const Container = styled.div`
  flex: 1;
  padding: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

const Name = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const Symbol = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

const SuggestionItem = ({item}) => {
  const {locale} = useTranslation();

  return (
    <Link
      href={`/[lang]/market/[symbol]`}
      as={`/${locale}/market/${item.symbol}`}
    >
      <Container>
        <Symbol>
          {item.symbol}{' '}
          <span style={{color: '#888888'}}>{item.exchDisp}</span>
        </Symbol>
        <Name numberOfLines={1}>{item.name}</Name>
      </Container>
    </Link>
  );
};

export default React.memo(SuggestionItem);
