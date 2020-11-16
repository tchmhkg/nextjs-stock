import React, { useState, useEffect, useCallback } from "react";
import { BookmarkBorder as BookmarkBorderIcon, Bookmark as BookmarkIcon } from '@material-ui/icons';
import _ from 'lodash';

const Bookmark = ({ticker}) => {
  const [saved, setSaved] = useState(null);

  const onPressSaveSymbol = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _.find(existingJson, ['symbol', ticker]);
      if (isExisted) {
        return;
      }
      const newList = [
        ...existingJson,
        {symbol: ticker},
      ];

      await window.localStorage.setItem('symbols', JSON.stringify(newList));
      setSaved(true);
    } catch (e) {
      console.log(e);
    }
  }, [ticker, saved]);

  const onPressRemoveSymbol = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const newList = _.filter(
        existingJson,
        (stock) => stock.symbol !== ticker,
      );

      await window.localStorage.setItem('symbols', JSON.stringify(newList));
      setSaved(false);
    } catch (e) {
      console.log(e);
    }
  }, [ticker, saved]);

  useEffect(() => {
    const getStatusFromStorage = async () => {
      const existing = await window.localStorage.getItem('symbols');
      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = existingJson.find(item => item.symbol === ticker);
      setSaved(isExisted ? true : false);
    };
    getStatusFromStorage();
  }, [ticker]);

  // TODO: merge to single function
  return (
    <div onClick={saved ? onPressRemoveSymbol : onPressSaveSymbol}>
        {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </div>
  );
};

export default React.memo(Bookmark);
