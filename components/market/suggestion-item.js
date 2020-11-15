import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const Container = styled.div`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
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
      href={`/[lang]/market/stock?id=${item.symbol}`}
      as={`/${locale}/market/stock?id=${item.symbol}`}
    >
      <Container>
        <div>
          <Symbol>
            {item.symbol}{' '}
            <span style={{color: '#888888'}}>{item.exchDisp}</span>
          </Symbol>
          <Name numberOfLines={1}>{item.name}</Name>
        </div>
      </Container>
    </Link>
  );
};

export default SuggestionItem;
