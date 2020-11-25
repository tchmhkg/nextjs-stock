import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import axios from "axios";
import styled from "styled-components";

import useTranslation from "~/hooks/useTranslation";
import IndexPrice from "~/components/market-indices/index-price";
import Carousel from "~/components/market/carousel";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 250px;
  @media (max-width: 768px) {
    min-width: ${props => props.isFuture ? '180px' : '150px'};
  }
`;

const Label = styled.span`
  color: ${props => props.theme.text};
  font-size: 18px;
  text-transform: uppercase;
`;

const LabelContainer = memo(({label = ''}) => {
  const { t } = useTranslation();
  return <Label>{t(label)}</Label>
})

const USIndices = () => {
    const [data, setData] = useState(null);
  const [chartInfoHtml, setChartInfoHtml] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
        getIndices();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getIndices();
  }, [])

  const getIndices = async () => {
    try {
      const res = await axios.get('/api/market/us-indices');
      console.log(res?.data);
      if(res?.data?.data) {
          setData(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
      <div> 
        <div>{data?.symbol}</div>
        <div>{data?.last_value}</div>
        <div dangerouslySetInnerHTML={{__html: chartInfoHtml}} />
      </div>
  )

//   const getQuotes = useCallback(() => {
//     axios
//       .get('/api/market/indices')
//       .then((res) => {
//         if (res?.data && res?.data?.data) {
//           setPrices(Object.values(res?.data?.data));
//         }
//       })
//       .catch(function (thrown) {
//         if (axios.isCancel(thrown)) {
//           console.log("Request canceled", thrown.message);
//         } else {
//           console.log(thrown);
//           console.log(thrown?.response);
//         }
//       });
//   }, [prices]);

//   const renderIndexContent = useCallback((priceObj) => {
//     return (
//       <Wrapper key={priceObj?.symbol}>
//         <LabelContainer label={priceObj?.symbol} />
//         <IndexPrice priceObj={priceObj} />
//       </Wrapper>
//     );
//   }, [prices]);

//   const renderFutureContent = useCallback((priceObj) => {
//     return (
//       <Wrapper isFuture key={priceObj?.symbol}>
//         <LabelContainer label={priceObj?.symbol} />
//         <IndexPrice priceObj={priceObj} isFuture />
//       </Wrapper>
//     );
//   }, [prices]);

//   return (
//     <Carousel>
//       {prices?.map((priceObj) => {
//         if (priceObj.assetType === "INDEX") {
//           return renderIndexContent(priceObj);
//         } else {
//           return renderFutureContent(priceObj);
//         }
//       })}
//     </Carousel>
//   );
};

export default USIndices;
