import React, { useState, useEffect, useCallback } from "react";
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HeartFullIcon, HeartBorderIcon } from '~/components/ui/icon';

const IconWrapper = styled(motion.div)`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: absolute;
  right: 15px;
  top: -25px;
  width: 22px;
  height: 22px;
`;

const iconAnimConfig = { scale: 1.3 };

const Bookmark = ({symbol}) => {
  const [saved, setSaved] = useState(null);

  const onPressSaveSymbol = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _find(existingJson, ['symbol', symbol]);
      if (isExisted) {
        return;
      }
      const newList = [
        ...existingJson,
        {symbol: symbol},
      ];

      await window.localStorage.setItem('symbols', JSON.stringify(newList));
      setSaved(true);
    } catch (e) {
      console.log(e);
    }
  }, [symbol, saved]);

  const onPressRemoveSymbol = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const newList = _filter(
        existingJson,
        (stock) => stock.symbol !== symbol,
      );

      await window.localStorage.setItem('symbols', JSON.stringify(newList));
      setSaved(false);
    } catch (e) {
      console.log(e);
    }
  }, [symbol, saved]);

  useEffect(() => {
    const getStatusFromStorage = async () => {
      const existing = await window.localStorage.getItem('symbols');
      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = existingJson.find(item => item.symbol === symbol);
      setSaved(isExisted ? true : false);
    };
    getStatusFromStorage();
  }, [symbol]);

  // TODO: merge to single function
  return (
    <IconWrapper whileTap={iconAnimConfig} onClick={saved ? onPressRemoveSymbol : onPressSaveSymbol}>
        {saved ? <HeartFullIcon  /> : <HeartBorderIcon />}
    </IconWrapper>
  );
};

export default React.memo(Bookmark);
