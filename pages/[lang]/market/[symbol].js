import React, { memo, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import useTranslation from '~/hooks/useTranslation';
import { getLastAndClosePriceFromYahoo } from '~/utils';
import Layout from '~/components/layout';
import { BlockSkeleton } from '~/components/ui/skeleton';

const LatestPrice = dynamic(import('~/components/market/latest-price'));
const NewsContainer = dynamic(import('~/components/market/news-container'));
const Bookmark = dynamic(import('~/components/market/bookmark'));
// const Charts = dynamic(import('~/components/market/charts'));

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0;
`;

const DescWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  p {
    color: ${(props) => props.theme.text};
  }
`;

const DescSkeleton = styled(BlockSkeleton)`
  margin-bottom: 8px;
`;

const StickyWrapper = styled(motion.div)`
  position: sticky;
  top: 69px;
  left: 0;
  background-color: ${(props) => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  padding: 5px 15px;
  margin: 0 -15px;
  z-index: 10;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;


const CompanyDesc = memo(({ description = '' }) => {
  const { t } = useTranslation();
  const renderSkeleton = useCallback(() => {
    let result = [];
    for(let i = 0; i < 6; i++) {
      result.push(<DescSkeleton key={i} size="full"/>)
    }
    return result
  }, [])

  return (
    <div>
      <Title>{t('Company Info')}</Title>
      <DescWrapper>
        {description ? (<div>{description}</div>) : <>
          {renderSkeleton()}
        </>}
      </DescWrapper>
    </div>
  );
});

const Stock = ({ symbol, data = [] }) => {
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState(null);
  const { lastPrice, closePrice } = getLastAndClosePriceFromYahoo(data);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!symbol) {
          return;
        }
        const res = await axios.get('/api/market/stockInfo', {
          params: {
            symbol,
          },
        });
        const {desc} = res?.data;
        setLoading(false);
        setDesc(desc);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getData();
  }, [symbol]);

  return (
    <Layout showAvatar={false} back backUrl="/market">
      <Head>
        <title>{symbol}</title>
      </Head>
      <StickyWrapper layout layoutId={symbol}>
        <LatestPrice data={{lastPrice, closePrice}} symbol={symbol} isDelayed={data?.quoteSourceName === 'Delayed Quote'}/>
        <Bookmark symbol={symbol} />
      </StickyWrapper>

      <CompanyDesc description={desc} />
      {/* <Charts symbol={symbol} /> */}
      <NewsContainer symbol={symbol} />

    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const { symbol } = ctx.query || '';
  return {
    props: {
      symbol,
    },
  };
}

export default Stock;
