import React, { useMemo } from "react";
import styled from "styled-components";
import axios from "axios";
import dynamic from 'next/dynamic';
import useSWR from "swr";

const SuggestionItem = dynamic(import('~/components/market/suggestion-item'));

const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundAlt};
  z-index: 10;
  position: absolute;
  top: 40px;
  max-height: 300px;
  width: calc(100vw - 31px);
  width: -webkit-calc(100vw - 31px);
  width: -moz-calc(100vw - 31px);
  width: -ms-calc(100vw - 31px);
  width: -o-calc(100vw - 31px);
  overflow-y: auto;
`;
const fetcher = (url, params) => axios.get(url, {params}).then(res => res.data);

const Suggestion = ({ symbol, ...props }) => {
  const params = useMemo(() => ({symbol}), [symbol]);
  const { data, error } = useSWR(['/api/market/autocomplete', params], fetcher);
  return (
    <Container>
      {!data && <div>Loading...</div>}
      {data && data.result?.map((item) => <SuggestionItem key={item.ticker} item={item} />)}
    </Container>
  );
};

export default Suggestion;
