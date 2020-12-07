import { useCallback, memo, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { useTheme } from "~/theme";
import styles from "~/components/theme-switcher.module.scss";

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
      data-enabled={isOn}
      data-on="🌜"
      data-off="🌞"
      onClick={onChangeTheme}
    >
      <motion.div className={styles.handle} layout transition={spring} />
    </div>
  );
};

export default memo(ThemeSwitcher);
