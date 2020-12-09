import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { motion, AnimateSharedLayout } from "framer-motion";

import useTranslation from '~/hooks/useTranslation';
import { useTheme } from '~/theme';

const AreaChart = dynamic(import('~/components/market/area-chart'));
const CandleStickChart = dynamic(import('~/components/market/candlestick-chart'));

const MotionBg = styled(motion.div)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-radius: 5px;
`;

const OptionsGroup = styled(motion.div)`
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
  color: ${({ theme, active }) => (active ? '#ffffff' : theme.text)};
  cursor: ${({ active }) => (active ? 'normal' : 'pointer')};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  position: relative;
  .option-label {
    z-index: 5;
  }
`;

const Charts = ({ symbol }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [view, setView] = useState('time');

  return (
    <div>
      <h3>{t('Chart')}</h3>
    <AnimateSharedLayout>
      <OptionsGroup>
        <Option layout onClick={() => setView('time')} active={view === 'time'}>
          <div className="option-label">{t('Time Frame')}</div>
          {view === 'time' && (
            <MotionBg 
              layoutId="option"
              initial={false}
              animate={{ background: `linear-gradient(to right, ${colors.primary2}, ${colors.primary1})` }}
              transition={spring}
            />
          )}
        </Option>
        <Option layout onClick={() => setView('1d')} active={view === '1d'}>
          <div className="option-label">{t('1d')}</div>
          {view === '1d' && (
            <MotionBg
              layoutId="option"
              initial={false}
              animate={{ background: `linear-gradient(to right, ${colors.primary2}, ${colors.primary1})` }}
              transition={spring}
            />
          )}
        </Option>
      </OptionsGroup>
    </AnimateSharedLayout>
      {view === 'time' ? (
        <AreaChart symbol={symbol} />
      ) : (
        <CandleStickChart symbol={symbol} />
      )}
    </div>
  );
};

const spring = {
  type: "spring",
  bounce: 0,
  duration: 0.4
};

export default Charts;
