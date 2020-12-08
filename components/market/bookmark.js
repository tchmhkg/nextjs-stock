import React, { useState, useEffect, useCallback } from "react";
import { FavoriteBorder as BorderIcon, Favorite as Icon } from '@material-ui/icons';
import _ from 'lodash';
import { motion } from 'framer-motion';
import { makeStyles } from "@material-ui/core/styles";


const iconStyles = () => {
  return {
    activeIcon: {
      color: "#F47983",
    },
    inactiveIcon: {
      color: "#b2b2b2",
    },
  };
}

const Bookmark = ({symbol}) => {
  const [saved, setSaved] = useState(null);
  const classes = makeStyles(iconStyles)();

  const onPressSaveSymbol = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('symbols');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _.find(existingJson, ['symbol', symbol]);
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
      const newList = _.filter(
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
    <motion.div whileTap={{ scale: 1.3 }} onClick={saved ? onPressRemoveSymbol : onPressSaveSymbol}>
        {saved ? <Icon className={classes.activeIcon} /> : <BorderIcon />}
    </motion.div>
  );
};

export default React.memo(Bookmark);
