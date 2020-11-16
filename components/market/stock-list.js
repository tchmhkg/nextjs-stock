import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";

import { TDA_QUOTES_API } from "~/utils/apiUrls";
import { TDA_CLIENT_ID } from "~/utils/config";
import useTranslation from "~/hooks/useTranslation";

import StockItem from "~/components/market/item";
import SearchInput from '~/components/market/input';

// const dummyData = [
//   { symbol: "AAPL", name: "Apple" },
//   { symbol: "GOOG", name: "Google" },
//   { symbol: "AMD", name: "AMD Inc." },
//   { symbol: "TSLA", name: "Tesla" },
// ];

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const EmptyContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyDataText = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text};
`;

const StockList = () => {
  const { locale, t } = useTranslation();

  const [stocks, setStocks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  let isCancelled = useRef(false);
  const [ticker, setTicker] = useState("");

  const onChangeTicker = (e) => {
    setTicker(e.target.value);
  }

  const resetTicker = () => {
    setTicker('');
  }

  useEffect(() => {
    const getFromStorage = async() => {
      try {
        let data = await window.localStorage.getItem('symbols');
        let jsonData = [];
        if(data !== null) {
          jsonData = JSON.parse(data);
          if (jsonData?.length) {
            setStocks(jsonData);
            const symbolsString = jsonData.map(({ symbol }) => symbol).join(",");
            getQuotes(symbolsString);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    getFromStorage();
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await window.localStorage.getItem('symbols');
        if (data !== null) {
          // console.log(JSON.parse(data));
          const jsonData = JSON.parse(data);
          if (jsonData?.length) {
            const symbolsString = jsonData.map(({symbol}) => symbol).join(',');
            getQuotes(symbolsString);
          } else {
            setIsRefreshing(false);
          }
          // setStocks(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing) {
      fetchStocks();
    }
  }, [isRefreshing])

  const getQuotes = (symbols) => {
    axios
      .get(TDA_QUOTES_API, {
        cancelToken: source.token,
        // headers: {
        //   Authorization: 'Bearer ' + authInfo?.access_token,
        // },
        params: {
          symbol: symbols,
          apikey: TDA_CLIENT_ID,
        },
      })
      .then((res) => {
        if (res?.data && !isCancelled.current) {
          // console.log(res.data);
          setStocks(Object.values(res?.data));
          // console.log(Object.values(res?.data));
        }
        setIsRefreshing(false);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        } else {
          console.log(thrown);
        }
        setIsRefreshing(false);
      });
  };

  return (
    <div>
      <SearchInput 
        value={ticker}
        onChange={onChangeTicker}
        onSearchClear={resetTicker}
      />
      {stocks && stocks.length ? (
      <>
        {t('Saved Stock List')}
        {stocks?.map((stock) => (
          <StockItem key={stock.symbol} item={stock} refreshing={isRefreshing} />
        ))}
      </>
      ) : (
        <EmptyContainer>
          <EmptyDataText>{t('Your list is empty!')}</EmptyDataText>
        </EmptyContainer>
      )}
    </div>
  );
};

export default StockList;
