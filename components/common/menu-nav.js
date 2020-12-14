import * as React from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from './menu-item';
import styles from './menu.module.scss';
import Link from 'next/link';
import useTranslation from '~/hooks/useTranslation';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    transitionEnd: { display: 'block' },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    transitionEnd: { display: 'none' },
  },
};

export const Nav = ({ toggle }) => {
  const { locale } = useTranslation();

  return (
    <motion.ul className={styles.ul} variants={variants}>
      {menuItems.map((item, index) => (
        <Link
          key={`${item.label}-${item.link}`}
          href={`/[lang]/${item.link}`}
          as={`/${locale}/${item.link}`}
        >
          <div onClick={toggle}>
            <MenuItem item={item} index={index} />
          </div>
        </Link>
      ))}
    </motion.ul>
  );
};

const menuItems = [
  {
    label: 'Home',
    link: '',
  },
  {
    label: 'US Market',
    link: 'market',
  },
  {
    label: 'HK Market',
    link: 'market/hk',
  },
];

const itemIds = [0, 1, 2, 3, 4];
