import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import SuggestionItem from "~/components/market/suggestion-item";
// import {symbolSuggest} from '~/utils/finance';

const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundAlt};
  z-index: 10;
  position: absolute;
  top: 40px;
  max-height: 300px;
  width: calc(100vw - 31px);
  overflow-y: auto;
`;

const Suggestion = ({ symbol, ...props }) => {
  const [suggestion, setSuggestion] = useState([]);

  const getSuggestion = React.useCallback(async () => {
    // const results = await symbolSuggest(symbol);
    const results = await axios.get("/api/market/getSuggestion", {
      params: {
        symbol,
      },
    });
    console.log("result => ", results?.data?.data);
    setSuggestion(results?.data?.data);
  }, [symbol]);

  useEffect(() => {
    if (!symbol) {
      return;
    }
    getSuggestion();
  }, [symbol]);

  return (
    <Container>
      {suggestion.map((item) => {
        return <SuggestionItem item={item} />;
      })}
    </Container>
  );
};

export default Suggestion;
