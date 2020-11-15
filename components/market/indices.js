import React, { useEffect, useState, useRef } from "react";
import { TDA_CLIENT_ID } from "~/utils/config";
import axios from "axios";
import styled from "styled-components";
import { TDA_QUOTES_API } from "~/utils/apiUrls";
// import {useTheme} from '~/Theme';
import IndexPrice from "~/components/market-indices/index-price";
import Carousel from "~/components/market/carousel";
import useTranslation from "~/hooks/useTranslation";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Wrapper = styled.div`
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 150px;
  height: 50px;
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const Label = styled.span`
  color: ${props => props.theme.text};
`;

const MarketIndices = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  let isCancelled = useRef(false);
  // const {t} = useLocale();
  // const {colors, mode} = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getQuotes = () => {
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
  };

  const renderIndexContent = (priceObj) => {
    // Temp
    // priceObj.lastPrice = Math.floor(Math.random() * 1000);
    return (
      <Wrapper key={priceObj?.symbol}>
        <Label numberOfLines={2}>{t(priceObj?.symbol)}</Label>
        <IndexPrice priceObj={priceObj} />
      </Wrapper>
    );
  };

  const renderFutureContent = (priceObj) => {
    // Temp
    // priceObj.lastPriceInDouble = Math.floor(Math.random() * 1000);
    return (
      <Wrapper key={priceObj?.symbol}>
        <Label numberOfLines={2}>{t(priceObj?.symbol)}</Label>
        <IndexPrice priceObj={priceObj} isFuture />
      </Wrapper>
    );
  };

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
