import React, { useEffect, useState, useRef } from "react";
import { TDA_CLIENT_ID } from "../../utils/config";
import axios from "axios";
import styled from "styled-components";
import { TDA_QUOTES_API } from "../../utils/apiUrls";
// import {useTheme} from '~/Theme';
import IndexPrice from "../market-indices/index-price";
import styles from "./indices.module.css";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const Wrapper = styled.div`
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Label = styled.span`
  color: #0b0b0b;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const MarketIndices = () => {
  const [prices, setPrices] = useState([]);
  const [viewIndex, setViewIndex] = useState(0);
  let isCancelled = useRef(false);
  // const {t} = useLocale();
  // const {colors, mode} = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      getQuotes();
    }, 1000);
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

  const renderIndexContent = (priceObj) => (
    <Wrapper key={priceObj?.symbol}>
      <Label numberOfLines={2}>{priceObj?.description}</Label>
      <IndexPrice priceObj={priceObj} />
    </Wrapper>
  );

  const renderFutureContent = (priceObj) => (
    <Wrapper key={priceObj?.symbol}>
      <Label numberOfLines={2}>{priceObj?.description}</Label>
      <IndexPrice priceObj={priceObj} isFuture />
    </Wrapper>
  );

  const onClickView = (index) => setViewIndex(index);

  return (
      <div>
        <ButtonWrapper>
          <button
            className={`${styles.button} ${
              viewIndex === 0 ? styles.selectedButton : ""
            }`}
            onClick={() => onClickView(0)}
          >
            Index
          </button>
          <button
            className={`${styles.button} ${
              viewIndex === 1 ? styles.selectedButton : ""
            }`}
            onClick={() => onClickView(1)}
          >
            Future
          </button>
        </ButtonWrapper>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap' }}>
          {viewIndex === 0
            ? prices?.slice(0, 3).map(renderIndexContent)
            : prices?.slice(3, 6).map(renderFutureContent)}
        </div>
      </div>
  );
};

export default MarketIndices;
