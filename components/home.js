import Link from "next/link";
import utilStyles from "~/styles/utils.module.scss";
import useTranslation from "~/hooks/useTranslation";
import styled from 'styled-components';
import { differenceBetweenValues } from "~/utils";
import { useAnimation } from "framer-motion";
import { useTheme } from "~/theme";

const Heading = styled.h2`
  color: ${props => props.theme.text};
`;

const Home = ({ allPostsData = [] }) => {
  const { locale, t } = useTranslation();
  const { colors } = useTheme();
  const controls = useAnimation();
  const oldV = 12383.00;
  const newV = 14383.75;
  const diff = differenceBetweenValues({
    oldValue: oldV, 
    newValue: newV,
    controls,
    theme: colors
  });

  const onClick = () => {
    const difference = newV - oldV;
    let type = 'rest';
    if(difference > 0) {
      type = 'up';
    } else if (difference < 0) {
      type = 'down';
    }
    controls.start(type);
  }

  return (
  <div>
      <Link href="/[lang]/market" as={`/${locale}/market`}>{t('Click here to market list')}</Link>
      <br />
      <div>
      Test:<br/>
      <button onClick={onClick}>Start animation</button>
      {diff.map(d => <span key={Math.random()}>{d}</span>)}
      </div>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Heading className={utilStyles.headingLg}>{t('Articles')}</Heading>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, title, date }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/[lang]/posts/${id}`} as={`/${locale}/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
export default React.memo(Home);

