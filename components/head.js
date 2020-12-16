import { memo } from 'react';
import NextHead from 'next/head';
import { useTheme } from '~/theme';

const Head = ({ children }) => {
  const { mode } = useTheme();
  return (
    <NextHead>
      <meta name="apple-mobile-web-app-status-bar-style" content={mode === 'dark' ? 'black-translucent' : 'default'} />
      {children}
    </NextHead>
  );
};

export default memo(Head);
