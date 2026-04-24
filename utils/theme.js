import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const themes = {
  Moss: {
    name: 'Moss',
    background: '#EEF2EC',
    card: '#F7FAF6',
    border: '#D9E4D6',
    surface: '#E2EBE0',
    surfaceBorder: '#CFDCCB',
    accent: '#7a9e76',
    accentText: '#F7FAF6',
    textPrimary: '#232C22',
    textSecondary: '#7A8F78',
    textMuted: '#657064',
    badgeDisabled: '#C8D8C5',
    loadingBg: '#EEF2EC',
    danger: '#C4897A',
  },
  Stone: {
    name: 'Stone',
    background: '#F5F2ED',
    card: '#FDFBF8',
    border: '#EAE6DF',
    surface: '#F0EBE2',
    surfaceBorder: '#E0D9CF',
    accent: '#C9B99A',
    accentText: '#FDFBF8',
    textPrimary: '#2C2A25',
    textSecondary: '#9E9A93',
    textMuted: '#797670',
    badgeDisabled: '#D8D4CD',
    loadingBg: '#F5F2ED',
    danger: '#C4897A',
  },
  Mist: {
    name: 'Mist',
    background: '#EEF1F4',
    card: '#F7F9FB',
    border: '#D9DFE6',
    surface: '#E2E8EE',
    surfaceBorder: '#CDD5DE',
    accent: '#7A95AA',
    accentText: '#F7F9FB',
    textPrimary: '#232830',
    textSecondary: '#7A8A96',
    textMuted: '#626c74',
    badgeDisabled: '#C8D4DC',
    loadingBg: '#EEF1F4',
    danger: '#C4897A',
  },
  Clay: {
    name: 'Clay',
    background: '#F4EFE8',
    card: '#FDFAF6',
    border: '#E8DFD2',
    surface: '#EDE4D8',
    surfaceBorder: '#DDD3C4',
    accent: '#B8956A',
    accentText: '#FDFAF6',
    textPrimary: '#2E2720',
    textSecondary: '#9E8E7A',
    textMuted: '#74695d',
    badgeDisabled: '#D8CCBC',
    loadingBg: '#F4EFE8',
    danger: '#C4897A',
  },
  Dusk: {
    name: 'Dusk',
    background: '#F0EEF5',
    card: '#FAF9FD',
    border: '#E0DCF0',
    surface: '#E8E4F2',
    surfaceBorder: '#D8D2EA',
    accent: '#8E82BE',
    accentText: '#FAF9FD',
    textPrimary: '#272238',
    textSecondary: '#8A82A0',
    textMuted: '#6c687c',
    badgeDisabled: '#CEC8E4',
    loadingBg: '#F0EEF5',
    danger: '#C4897A',
  },
  Sakura: {
    name: 'Sakura',
    background: '#F5EFF0',
    card: '#FDF8F9',
    border: '#EAD9DC',
    surface: '#F0E4E6',
    surfaceBorder: '#E4D0D4',
    accent: '#C48A94',
    accentText: '#FDF8F9',
    textPrimary: '#2E2224',
    textSecondary: '#A08488',
    textMuted: '#793c44',
    badgeDisabled: '#DCC8CC',
    loadingBg: '#F5EFF0',
    danger: '#C4897A',
  },
  Ink: {
    name: 'Ink',
    background: '#1E1E1E',
    card: '#272727',
    border: '#363636',
    surface: '#303030',
    surfaceBorder: '#3E3E3E',
    accent: '#8A8A8A',
    accentText: '#F0F0F0',
    textPrimary: '#F0F0F0',
    textSecondary: '#c0c0c0',
    textMuted: '#b6b6b6',
    badgeDisabled: '#444444',
    loadingBg: '#1E1E1E',
    danger: '#E07070',
  },
};

const THEME_KEY = 'app_theme';
const FONT_KEY  = 'app_font_scale';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('Stone');
  const [fontScale, setFontScaleState] = useState(1.0);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem(FONT_KEY),
    ]).then(([savedTheme, savedFont]) => {
      if (savedTheme && themes[savedTheme]) setThemeName(savedTheme);
      if (savedFont) setFontScaleState(parseFloat(savedFont));
    });
  }, []);

  function selectTheme(name) {
    setThemeName(name);
    AsyncStorage.setItem(THEME_KEY, name);
  }

  function setFontScale(val) {
    setFontScaleState(val);
    AsyncStorage.setItem(FONT_KEY, String(val));
  }

  return (
    <ThemeContext.Provider value={{
      theme: themes[themeName],
      themeName,
      selectTheme,
      fontScale,
      setFontScale,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}