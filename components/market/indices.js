import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";

import { TDA_QUOTES_API } from "~/utils/apiUrls";
import { TDA_CLIENT_ID } from "~/utils/config";
import useTranslation from "~/hooks/useTranslation";
import IndexPrice from "~/components/market-indices/index-price";
import Carousel from "~/components/market/carousel";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Wrapper = styled.div`
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 160px;
  height: 50px;
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const Label = styled.span`
  color: ${props => props.theme.text};
  font-size: 18px;
  text-transform: uppercase;
`;

const MarketIndices = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  let isCancelled = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if(TDA_CLIENT_ID) {
        getQuotes();
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getQuotes = useCallback(() => {
    axios
      .get(TDA_QUOTES_API, {
        cancelToken: source.token,
        params: {
          apikey: TDA_CLIENT_ID,
          symbol: "$DJI,$COMPX,$SPX.X,/YM,/NQ,/ES",
        },
      })
      .then((res) => {
        if (res?.data && !isCancelled.current) {
          // console.log(Object.values(res?.data));
          setPrices(Object.values(res?.data));
        }
        // setIsRefreshing(false);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        } else {
          console.log(thrown);
          console.log(thrown?.response);
        }
        // setIsRefreshing(false);
      });
  }, [prices]);

  const renderIndexContent = useCallback((priceObj) => {
    return (
      <Wrapper key={priceObj?.symbol}>
        <Label numberOfLines={2}>{t(priceObj?.symbol)}</Label>
        <IndexPrice priceObj={priceObj} />
      </Wrapper>
    );
  }, [prices]);

  const renderFutureContent = useCallback((priceObj) => {
    return (
      <Wrapper key={priceObj?.symbol}>
        <Label numberOfLines={2}>{t(priceObj?.symbol)}</Label>
        <IndexPrice priceObj={priceObj} isFuture />
      </Wrapper>
    );
  }, [prices]);

  return (
    <Carousel>
      {prices?.map((priceObj) => {
        if (priceObj.assetType === "INDEX") {
          return renderIndexContent(priceObj);
        } else {
          return renderFutureContent(priceObj);
        }
      })}
    </Carousel>
  );
};

export default MarketIndices;
