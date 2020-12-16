import { memo } from 'react';
import NextHead from 'next/head';
import { useTheme } from '~/theme';

const Head = ({ children }) => {
  const { mode } = useTheme();
  return (
    <NextHead>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5"
      />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content={mode === 'dark' ? 'black-translucent' : 'default'}
      />
      <title>Next Stock</title>
      {children}
    </NextHead>
  );
};

export default memo(Head);
