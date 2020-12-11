import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import dynamic from "next/dynamic";

import SearchInput from '~/components/market/input';

import useTranslation from "~/hooks/useTranslation";
import { usePageVisibility } from "~/hooks/usePageVisibility";
import Refresh from "~/components/refresh";

const StockItem = dynamic(import('~/components/market/item'));

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

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

// const DelayReminder = styled.span`
//   font-size: 14px;
// `;

const StockList = () => {
  const { locale, t } = useTranslation();
  const isVisible = usePageVisibility();

  const [stocks, setStocks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  let isCancelled = useRef(false);
  const [symbol, setSymbol] = useState("");

  const onChangeSymbol = (e) => {
    setSymbol(e.target.value?.toUpperCase());
  }

  const resetSymbol = () => {
    setSymbol('');
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
            if(isRefreshing) {
              setIsRefreshing(false);
            }
          }
          // setStocks(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
        if(isRefreshing) {
          setIsRefreshing(false);
        }
      }
    };
    if (isRefreshing) {
      fetchStocks();
    }
  }, [isRefreshing])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await window.localStorage.getItem('symbols');
        if (data !== null) {
          const jsonData = JSON.parse(data);
          if (jsonData?.length) {
            const symbolsString = jsonData.map(({symbol}) => symbol).join(',');
            getQuotes(symbolsString);
          } else {
            if(isRefreshing) {
              setIsRefreshing(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
        if(isRefreshing) {
          setIsRefreshing(false);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const getQuotes = (symbols) => {
    if(!isVisible) {
      console.log('stock list page not visible, quit');
      return;
    }
    axios
      .get('/api/market/quotes', {
        params: {
          symbol: symbols
        }
      })
      .then((res) => {
        if (res?.data && !isCancelled.current) {
          // console.log(res.data);
          setStocks(res?.data?.data);
          // setStocks(Object.values(res?.data));
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

  const onClickRefresh = useCallback(() => {
    setIsRefreshing(true);
  }, []);

  return (
    <div style={{marginTop: 75}}>
      <hr />
      <SearchInput 
        value={symbol}
        onChange={onChangeSymbol}
        onSearchClear={resetSymbol}
      />
      {stocks && stocks.length ? (
      <>
        <HeaderWrapper>
          <span>{t('Saved Stock List')}</span>
          <Refresh onClick={onClickRefresh} />
          {/* <DelayReminder>{t('Delay +20 min.')}</DelayReminder> */}
        </HeaderWrapper>
        {stocks?.map((stock) => (
          <StockItem key={stock.symbol} item={stock} />
        ))}
      </>
      ) : (
        <EmptyContainer>
          <EmptyDataText>{t('It\'s empty here.')}</EmptyDataText>
        </EmptyContainer>
      )}
    </div>
  );
};

export default StockList;
