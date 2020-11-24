import React, { useEffect, memo } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '~/theme';

const Wrapper = styled.div`
  background-color: ${props => props.theme.backgroundAlt};
  width: 70px;
  height: 70px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10;
  top: calc(100vh / 2 - 35px);
  top: -webkit-calc(100vh / 2 - 35px);
  top: -moz-calc(100vh / 2 - 35px);
  top: -ms-calc(100vh / 2 - 35px);
  top: -o-calc(100vh / 2 - 35px);
  left: calc(100vw / 2 - 35px);
  left: -webkit-calc(100vw / 2 - 35px);
  left: -moz-calc(100vw / 2 - 35px);
  left: -ms-calc(100vw / 2 - 35px);
  left: -o-calc(100vw / 2 - 35px);
`;

const iconStyles = colors => {
  return {
    primary: {
      color: colors.primary,
    },
  };
}

const Spinner = () => {
  const {colors} = useTheme();
  const classes = makeStyles(iconStyles(colors))();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.removeProperty('overflow');
    }
  }, [])

  return (
    <Wrapper>
      <CircularProgress className={classes.primary}/>
    </Wrapper>
  );
}

export default memo(Spinner);