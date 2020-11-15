import {useCallback, memo} from 'react';
import styled from 'styled-components';
import { useTheme } from "~/theme";
import styles from '~/components/theme-switcher.module.scss';

const SwitchInner = styled.span`
  &:before, &:after {
    background-color: ${props => props.theme.toggleBackground};
  }
`;

const ThemeSwitcher = () => {
  const theme = useTheme();
  const onChangeTheme = useCallback((e) => {
    const {checked} = e.target;
    theme.setMode(checked ? 'dark' : 'light');
  }, [theme]);

  return (
    <div className={styles.toggleSwitch}>
      <input className={styles.toggleSwitchCheckbox} type="checkbox" name="theme-switcher" id="theme-switcher" checked={theme.mode === 'dark'} onChange={onChangeTheme}/>
      <label className={styles.toggleSwitchLabel} htmlFor="theme-switcher">
        <SwitchInner className={styles.toggleSwitchInner} data-on="🌜" data-off="🌞"></SwitchInner>
        <span className={styles.toggleSwitchSwitch}></span>
      </label>
    </div>
  )
}

export default memo(ThemeSwitcher);