import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import useTranslation from '~/hooks/useTranslation';

const AreaChart = dynamic({
  loader: () => import('~/components/market/area-chart'),
});

const CandleStickChart = dynamic({
  loader: () => import('~/components/market/candlestick-chart'),
});

const OptionsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 5px;
`;

const Option = styled.div`
  padding: 5px 15px;
  width: 50%;
  background: ${({ active, theme }) =>
    active ? theme.primary1 : 'transparent'};
  background: ${({ active, theme }) =>
    active
      ? `-webkit-linear-gradient(to right, ${theme.primary2}, ${theme.primary1});`
      : 'transparent'};
  background: ${({ active, theme }) =>
    active
      ? `linear-gradient(to right, ${theme.primary2}, ${theme.primary1});`
      : 'transparent'};
  color: ${({ theme, active }) => (active ? '#ffffff' : theme.text)};
  cursor: ${({ active }) => (active ? 'normal' : 'pointer')};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

const Charts = ({ symbol }) => {
  const { t } = useTranslation();
  const [view, setView] = useState('time');

  return (
    <div>
      <h3>{t('Chart')}</h3>
      <OptionsGroup>
        <Option onClick={() => setView('time')} active={view === 'time'}>
          {t('Time Frame')}
        </Option>
        <Option onClick={() => setView('1d')} active={view === '1d'}>
          {t('1d')}
        </Option>
      </OptionsGroup>
      {view === 'time' ? (
        <AreaChart symbol={symbol} />
      ) : (
        <CandleStickChart symbol={symbol} />
      )}
    </div>
  );
};

export default Charts;
