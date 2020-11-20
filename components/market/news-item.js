import React, { memo } from "react";
import moment from "moment";
import styled from "styled-components";
import styles from "~/components/market/news-item.module.scss";
import useTranslation from "~/hooks/useTranslation";

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

const PublishDate = memo(({date}) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.row} ${styles.metadataRow}`}>
      <Text>{t('Published at')}: {moment(date).fromNow()}</Text>
    </div>
  )
})

const TitleContainer = memo(({title, link}) => {
  return (
    <div className={styles.row}>
      <a href={link} target="_blank">
        <Title>{title}</Title>
      </a>
    </div>
  )
})

const NewsItem = ({item = {}}) => {
  const { title = '', link = '', pubDate = '' } = item;
  return (
    <Container>
      <TitleContainer title={title} link={link} />
      <PublishDate date={pubDate} />
    </Container>
  );
};

export default React.memo(NewsItem);
