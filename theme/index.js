import React, {createContext, useState, useEffect, useContext} from 'react';
import {ThemeProvider} from 'styled-components';

import lightTheme from '~/theme/light';
import darkTheme from '~/theme/dark';
import { useLocalStorage } from '~/hooks/useLocalStorage';

const ThemeContext = createContext({
  mode: 'light',
  setMode: (mode) => {},
  colors: {},
});

export const useTheme = () => useContext(ThemeContext);

const ManageThemeProvider = ({children}) => {
  const [modeFromStorage, setModeToStorage] = useLocalStorage('mode', 'light');
  const [themeState, setThemeState] = useState('light');

  useEffect(() => {
    if(themeState === 'dark') {
      document.body.style.backgroundColor = darkTheme.theme.background;
    } else {
      document.body.style.backgroundColor = lightTheme.theme.background;
    }
    setModeToStorage(themeState);
  }, [themeState])

  useEffect(() => {
    if(modeFromStorage) {
      setThemeState(modeFromStorage);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode: themeState,
        setMode: (mode) => setThemeState(mode),
        colors: themeState === 'dark' ? darkTheme.theme : lightTheme.theme,
      }}>
      <ThemeProvider
        theme={themeState === 'dark' ? darkTheme.theme : lightTheme.theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const ThemeManager = ({children}) => (
  <ManageThemeProvider>{children}</ManageThemeProvider>
);

export default ThemeManager;
