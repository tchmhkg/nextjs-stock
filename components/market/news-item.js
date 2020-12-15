import React, { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';
import styles from '~/components/market/news-item.module.scss';
import useTranslation from '~/hooks/useTranslation';

const Container = styled.div`
  padding: 5px 0;
  border-bottom: 1px solid ${(props) => props.theme.border};
  a {
    color: ${(props) => props.theme.text};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  a {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const Text = styled.span`
  color: ${(props) => props.theme.text};
  font-size: 14px;
`;

const PublishDate = memo(({ date }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.row} ${styles.metadataRow}`}>
      <Text>
        {t('Published at')}: {formatDistanceToNow(new Date(date), { addSuffix: true })}
      </Text>
    </div>
  );
});

const TitleContainer = memo(({ title, link }) => {
  return (
    <TitleWrapper>
      <a href={link} target="_blank">
        <Title>{title}</Title>
      </a>
    </TitleWrapper>
  );
});

const NewsItem = ({ item = {} }) => {
  const { title = '', link = '', pubDate = '' } = item;
  return (
    <Container>
      <TitleContainer title={title} link={link} />
      <PublishDate date={pubDate} />
    </Container>
  );
};

export default React.memo(NewsItem);
