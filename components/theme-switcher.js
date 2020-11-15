import {useCallback, memo} from 'react';
import { useTheme } from "~/theme";

const ThemeSwitcher = () => {
  const theme = useTheme();
  const onChangeTheme = useCallback((e) => {
    const {checked} = e.target;
    theme.setMode(checked ? 'dark' : 'light');
  }, [theme]);
  return (
    <div>
      <input type="checkbox" id="theme-switcher" checked={theme.mode === 'dark'} onChange={onChangeTheme}/>
      <label htmlFor="theme-switcher">Dark mode</label>
    </div>
  )
}

export default memo(ThemeSwitcher);