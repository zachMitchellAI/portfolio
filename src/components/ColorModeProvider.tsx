import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import {
  ThemeProvider,
  useColorScheme,
  getInitColorSchemeScript,
} from "@mui/material/styles";
import { theme, COLOR_MODE_STORAGE_KEY } from "../theme";
import type { Mode } from "../theme";

export interface ColorModeContextValue {
  /**
   * Raw MUI mode: 'light' | 'dark' | 'system' — 'system' means "follow the
   * OS preference" (the default until the user picks a mode manually).
   * Undefined before client hydration.
   */
  mode: "light" | "dark" | "system" | undefined;
  /** The actually rendered mode, after resolving 'system' against the OS. */
  resolvedMode: Mode | undefined;
  /** Flip light ↔ dark and persist the explicit choice to localStorage. */
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

/**
 * Rendered *inside* ThemeProvider so `useColorScheme()` can read the
 * color-scheme context it provides.
 */
function ColorModeState({ children }: { children: ReactNode }) {
  const { mode, systemMode, setMode } = useColorScheme();

  const contextValue = useMemo<ColorModeContextValue>(() => {
    const resolvedMode = mode === "system" ? systemMode : mode;
    return {
      mode,
      resolvedMode,
      toggleColorMode: () =>
        setMode(resolvedMode === "dark" ? "light" : "dark"),
    };
  }, [mode, systemMode, setMode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      {children}
    </ColorModeContext.Provider>
  );
}

/**
 * App root provider. MUI's ThemeProvider (CSS-vars path, active because the
 * theme has `colorSchemes`) already implements the mode rules we need:
 * - `defaultMode: 'system'` → follow `prefers-color-scheme` on first visit;
 * - live `matchMedia` change events, applied only while mode is 'system'
 *   (i.e. while the user hasn't manually overridden);
 * - manual choices persisted to localStorage under `modeStorageKey`
 *   ('portfolio-color-mode'), where a stored value beats the OS preference.
 */
export function ColorModeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      theme={theme}
      defaultMode="system"
      modeStorageKey={COLOR_MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <ColorModeState>{children}</ColorModeState>
    </ThemeProvider>
  );
}

export default ColorModeProvider;

/** Read the current color mode + toggle from any component under the provider. */
export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used inside <ColorModeProvider>");
  }
  return context;
}

/**
 * Optional no-FOUC helper for ticket 11: before the app bundle in index.html,
 * render
 * `getInitColorSchemeScript({ defaultMode: 'system', modeStorageKey: COLOR_MODE_STORAGE_KEY })`
 * so a stored dark choice paints dark immediately on reload.
 */
export { getInitColorSchemeScript };
