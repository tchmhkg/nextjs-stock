import React, { useRef, useEffect } from 'react';
import { motion, useCycle } from 'framer-motion';
import styled from 'styled-components';
import { MenuToggle } from './MenuToggle';
import { Nav } from './Nav';
import styles from './Menu.module.scss';

const bgVariants = {
  closed: {
    opacity: 1,
    transition: { duration: 0.2 },
    transitionEnd: { display: 'block' },
  },
  open: {
    opacity: 0,
    transition: { duration: 0.2 },
    transitionEnd: { display: 'none' },
  },
};

const sidebar = {
  open: () => {
    return {
      clipPath: `circle(5000px at 40px 40px)`,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    };
  },
  closed: () => {
    return {
      clipPath: 'circle(25px at 35px 35px)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    };
  },
};

const MenuPanel = styled(motion.div)`
  background: ${({ theme }) => theme.backgroundAlt};
  @media (min-width: 768px) {
    background: ${({ theme }) =>
      `linear-gradient(0.25turn, ${theme.backgroundAlt} 40%, transparent)`};
    width: 100%;
  }
`;

const LinearGradientBg = styled(motion.div)`
  background: ${({ isOpen, theme }) =>
    `linear-gradient(to right, ${theme.primary2} , ${theme.primary1} )`};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  z-index: 32;
  left: 10px;
  top: 10px;
`;

const NavBar = styled(motion.nav)`
  @media (max-width: 767px) {
    width: ${({isOpen}) => isOpen ? '100%' : '100px'};
  }
`;

export const Menu = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [isOpen]);

  return (
    <NavBar
      className={styles.nav}
      isOpen={isOpen}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      ref={containerRef}
    >
      <MenuPanel
        layout
        initial={false}
        className={styles.background}
        variants={sidebar}
      />
      <LinearGradientBg variants={bgVariants} />
      <Nav toggle={toggleOpen}/>
      <MenuToggle isOpen={isOpen} toggle={() => toggleOpen()} />
    </NavBar>
  );
};
