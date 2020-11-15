import React, { useCallback } from "react";
import moment from "moment";
import styled from "styled-components";
import styles from "~/components/market/news-item.module.scss";

const Container = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.border};
  a {
    color: ${props => props.theme.text}
  }
`;

const Title = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Text = styled.span`
  color: ${props => props.theme.text};
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
