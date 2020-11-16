import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import SuggestionItem from "~/components/market/suggestion-item";

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

  const getSuggestion = useCallback(async () => {
    if(!symbol) {
      return;
    }
    const results = await axios.get("/api/market/getSuggestion", {
      params: {
        symbol,
      },
    });
    setSuggestion(results?.data?.data);
  }, [symbol]);

  useEffect(() => {
    if (!symbol) {
      setSuggestion([]);
      return;
    }
    getSuggestion();
  }, [symbol]);

  return (
    <Container>
      {suggestion.map((item) => <SuggestionItem key={item.symbol} item={item} />)}
    </Container>
  );
};

export default Suggestion;
