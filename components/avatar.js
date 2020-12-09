import Link from "next/link";
import Image from "next/image";
import React, { memo } from "react";
import styles from "~/components/avatar.module.scss";
import utilStyles from "~/styles/utils.module.scss";
import { name } from "~/components/layout";
import useTranslation from "~/hooks/useTranslation";
import styled from 'styled-components';

const Name = styled.a`
  color: ${props => props.theme.text}
`;

const Avatar = () => {
  const { locale } = useTranslation();
  return (
    <div className={styles.header}>
      <Link href="/[lang]" as={`/${locale}`}>
        <a>
          <Image
            src="/images/profile.png"
            width={70 / 2}
            height={87.5 / 2}
            className={`${styles.headerImage} ${utilStyles.borderCircle}`}
            alt={name}
          />
        </a>
      </Link>
      <h2 className={styles.name}>
        <Link href="/[lang]" as={`/${locale}`}>
          <Name className={utilStyles.colorInherit}>{name}</Name>
        </Link>
      </h2>
    </div>
  );
};

export default memo(Avatar);
