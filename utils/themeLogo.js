import { useTheme } from './theme';

const themeLogos = {
  Moss: require('../assets/logo-moss.png'),
  Stone: require('../assets/logo-stone.png'),
  Mist: require('../assets/logo-mist.png'),
  Clay: require('../assets/logo-clay.png'),
  Dusk: require('../assets/logo-dusk.png'),
  Sakura: require('../assets/logo-sakura.png'),
  Ink: require('../assets/logo-ink.png'),
};

// Fallback caso alguma logo específica não exista
const defaultLogo = require('../assets/logo.png');

export const getThemeLogo = (themeName) => {
  return themeLogos[themeName] || defaultLogo;
};

// Hook para usar diretamente nos componentes
export const useThemeLogo = () => {
  const { themeName } = useTheme();
  return getThemeLogo(themeName);
};