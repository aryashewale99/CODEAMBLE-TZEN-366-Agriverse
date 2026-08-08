import { Colors, Typography, Spacing } from './colors';

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 999,
  },
  shadows: {
    small: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type ThemeType = typeof Theme;
export default Theme;
