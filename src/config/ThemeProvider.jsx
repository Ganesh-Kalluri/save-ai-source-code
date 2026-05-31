/**
 * SaveAI - React Custom Theme Context Provider
 * 
 * Re-constructs ThemeContext and ThemeProvider bindings to toggle 
 * stylesheet styling options seamlessly based on user selection.
 */

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(null);
const DEFAULT_THEME = "light";

export const ThemeProvider = ({ children, defaultTheme = DEFAULT_THEME }) => {
  const [theme, setThemeState] = useState(defaultTheme);
  const initialThemeRef = useRef(defaultTheme);
  const hasUserOverridden = useRef(false);

  useEffect(() => {
    if (defaultTheme && defaultTheme !== initialThemeRef.current && !hasUserOverridden.current) {
      initialThemeRef.current = defaultTheme;
      setThemeState(defaultTheme);
    }
  }, [defaultTheme]);

  const setTheme = useCallback((newTheme) => {
    hasUserOverridden.current = true;
    setThemeState(newTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
export default ThemeProvider;
