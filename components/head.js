import { memo } from "react";
import NextHead from "next/head";

const Head = ({ children }) => {
  return (
    <NextHead>
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      {children}
    </NextHead>
  );
};

export default memo(Head);
