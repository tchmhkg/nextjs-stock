import React from 'react';
import Date from "~/components/date";
import styles from "~/components/post/post-detail.module.scss";

const PostDetail = ({ data }) => {
  return (
    <article>
        <h1 className={styles.headingXl}>{data.title}</h1>
        <div className={styles.lightText}>
            <Date dateString={data.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
    </article>
  );
};
export default React.memo(PostDetail);
