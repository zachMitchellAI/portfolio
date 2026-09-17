import { createTheme } from "@mui/material/styles";
import type { ColorSystemOptions } from "@mui/material/styles";

/**
 * localStorage key for the manually chosen color mode ('light' | 'dark').
 * A stored value beats the OS preference; MUI's ThemeProvider reads/writes it
 * via `modeStorageKey` (see ColorModeProvider).
 */
export const COLOR_MODE_STORAGE_KEY = "portfolio-color-mode";

/** Explicit color mode (what a user's choice is stored as). */
export type Mode = "light" | "dark";

/**
 * Per-mode design tokens, fed into `createTheme({ colorSchemes })` so the
 * light and dark schemes are defined in exactly one place.
 */
export function getDesignTokens(mode: Mode): ColorSystemOptions {
  const isDark = mode === "dark";
  return {
    palette: {
      mode,
      background: isDark
        ? { default: "#202020", paper: "#12121e" }
        : { default: "#e8e8e8", paper: "#ffffff" },
      primary: { main: isDark ? "#9fa8ff" : "#3d4ec7" },
      secondary: { main: isDark ? "#5eead4" : "#0d9488" },
      text: isDark
        ? { primary: "#e8e8f0", secondary: "#9d9db0" }
        : { primary: "#16161f", secondary: "#55556a" },
      divider: isDark ? "rgba(232, 232, 240, 0.14)" : "rgba(22, 22, 31, 0.14)",
    },
  };
}

/**
 * App-wide theme. `cssVariables: true` + `colorSchemes` is the MUI v9 way to
 * ship one theme with light/dark variants. Pair it with `<ThemeProvider
 * defaultMode="system">` and read the active mode via `useColorScheme()`
 * from '@mui/material/styles' (wrapped by ColorModeProvider/useColorMode).
 */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data-mui-color-scheme" },
  colorSchemes: {
    light: getDesignTokens("light"),
    dark: getDesignTokens("dark"),
  },
  typography: {
    fontFamily: 'Consolas, "Courier New", ui-monospace, monospace',
  },
});
