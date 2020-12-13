import React, { useEffect, memo } from 'react';
import styled from 'styled-components';
import { useTheme } from '~/theme';
import styles from './spinner.module.scss';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.backgroundAlt};
  width: 70px;
  height: 70px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10;
  top: calc(100vh / 2 - 35px);
  left: calc(100vw / 2 - 35px);
`;

const Circle = styled.circle`
  stroke: url(#spinnerLinearColors);
`;

const Spinner = () => {
  const { colors } = useTheme();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, []);

  return (
    <Wrapper>
      <svg className={styles.spinner} viewBox="0 0 50 50">
        <defs>
          <linearGradient id="spinnerLinearColors" x1="0" y1="0" x2="1" y2="1">
            <stop offset="20%" stopColor={colors.primary1} />
            <stop offset="90%" stopColor={colors.primary2} />
          </linearGradient>
        </defs>
        <Circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
    </Wrapper>
  );
};

export default memo(Spinner);
