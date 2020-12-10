import * as React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import styles from './Menu.module.scss';
import useTranslation from '~/hooks/useTranslation';

const ItemText = styled.div`
  font-size: 24px;
`;

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = ['#FF008C', '#D309E1', '#9C1AFF', '#7700FF', '#4400FF'];

export const MenuItem = ({ item, index }) => {
  const { t } = useTranslation();
  const style = { color: colors[index] };
  return (
    <motion.li
      className={styles.li}
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <ItemText style={style}>{t(item.label)}</ItemText>
    </motion.li>
  );
};
