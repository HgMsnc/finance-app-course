import { createContext } from 'react';
import type { Theme } from '../utils/theme';

export interface ThemeApi {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeApi | null>(null);
