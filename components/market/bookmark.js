import React, { useState, useEffect, useCallback } from "react";
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import { motion } from 'framer-motion';
import { HeartFullIcon, HeartBorderIcon } from '~/components/ui/icon';
import styles from './bookmark.module.scss';

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
  }, [symbol]);

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
  }, [symbol]);

  useEffect(() => {
    const getStatusFromStorage = async () => {
      const existing = await window.localStorage.getItem('symbols');
      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = existingJson.find(item => item.symbol === symbol);
      if(isExisted) {
        setSaved(true);
      }
    };
    getStatusFromStorage();
  }, []);

  // TODO: merge to single function
  return (
    <motion.div className={styles.wrapper} whileTap={iconAnimConfig} onClick={saved ? onPressRemoveSymbol : onPressSaveSymbol}>
        {saved ? <HeartFullIcon  /> : <HeartBorderIcon />}
    </motion.div>
  );
};

export default React.memo(Bookmark);
