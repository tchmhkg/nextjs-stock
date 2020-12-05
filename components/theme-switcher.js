import { useCallback, memo, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { useTheme } from "~/theme";
import styles from "~/components/theme-switcher.module.scss";

const SwitchInner = styled.span`
  &:before,
  &:after {
    background-color: ${(props) => props.theme.toggleBackground};
  }
`;

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

const ThemeSwitcher = () => {
  const theme = useTheme();
  const [isOn, setIsOn] = useState(theme.mode === 'dark');
  const onChangeTheme = useCallback(
    (e) => {
      setIsOn(!isOn);
    },
    [theme, isOn]
  );

  useEffect(() => {
    theme.setMode(isOn ? "dark" : "light");
  }, [isOn])

  return (
    <div
      className={styles.switch}
      data-isOn={isOn}
      data-on="🌜"
      data-off="🌞"
      onClick={onChangeTheme}
    >
      <motion.div className={styles.handle} layout transition={spring} />
    </div>
  );

  return (
    <div className={styles.toggleSwitch}>
      <input
        className={styles.toggleSwitchCheckbox}
        type="checkbox"
        name="theme-switcher"
        id="theme-switcher"
        checked={theme.mode === "dark"}
        onChange={onChangeTheme}
      />
      <label className={styles.toggleSwitchLabel} htmlFor="theme-switcher">
        <SwitchInner
          className={styles.toggleSwitchInner}
          data-on="🌜"
          data-off="🌞"
        ></SwitchInner>
        <span className={styles.toggleSwitchSwitch} />
      </label>
    </div>
  );
};

export default memo(ThemeSwitcher);
