import React, { useCallback } from "react";
import moment from "moment";
import styled from "styled-components";
import styles from "./news-item.module.css";

const Container = styled.div`
  padding: 10px;
  border-bottom: 1px solid #000;
`;

const Title = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Text = styled.span`
  color: #000;
`;

const NewsItem = ({ item }) => {
  return (
    <Container>
      <div className={styles.row}>
        <a href={item?.link} target="_blank">
          <Title>{item.title}</Title>
        </a>
      </div>
      <div className={`${styles.row} ${styles.metadataRow}`}>
        <Text>Published at: {moment(item.pubDate).fromNow()}</Text>
      </div>
    </Container>
  );
};

export default React.memo(NewsItem);
