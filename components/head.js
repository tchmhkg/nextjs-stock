import { memo } from "react";
import NextHead from "next/head";

const Head = ({ children }) => {
  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
      <meta name='description' content='Get US stock quote' />
      <title>Next Stock</title>

      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/favicon.ico" />
      <link href='/favicon-16x16.png' rel='icon' type='image/png' sizes='16x16' />
      <link href='/favicon-32x32.png' rel='icon' type='image/png' sizes='32x32' />
      <link rel="apple-touch-icon" href="/icons/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-76x76.png"/>
      <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-152x152.png" />
      <meta name="theme-color" content="#0ECD9D"/>

      {children}
    </NextHead>
  );
};

export default memo(Head);
