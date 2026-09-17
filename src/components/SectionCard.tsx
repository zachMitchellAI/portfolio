import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { useColorMode } from "./ColorModeProvider";
import { getDesignTokens } from "../theme";

const lightPalette = getDesignTokens("light").palette;
const lightText = lightPalette?.text;
const lightBackground = lightPalette?.background;

interface SectionCardProps {
  children: ReactNode;
  /** Optional call-site overrides; spread last so they win. */
  sx?: SxProps;
}

/**
 * Translucent rounded container for a content section, giving the content
 * contrast against the animated background:
 * - light mode: black @ 50% (`rgba(0, 0, 0, 0.5)`) with white text overrides
 * - dark mode: white @ 14% (`rgba(255, 255, 255, 0.14)`)
 *
 * The mode is read reactively via `useColorMode()` — `useTheme().palette.mode`
 * is NOT reactive on the CSS-vars theme. No border, no shadow: a pure
 * translucent rounded container. Call sites may pass `sx` to adjust sizing.
 */
export default function SectionCard({ children, sx }: SectionCardProps) {
  const { resolvedMode } = useColorMode();
  const isDark = (resolvedMode ?? "light") === "dark";
  return (
    <Box
      sx={[
        {
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          bgcolor: isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.5)",
          // LIGHT mode only: the card is black-translucent, so every piece of
          // text inside must go white. MUI Typography/components resolve their
          // colors through the CSS-vars theme (theme.vars emits
          // `var(--mui-palette-text-primary)` etc.), and those vars cascade —
          // redefining them here recolors all card descendants while text
          // outside cards keeps the theme's dark-on-light values.
          // DARK mode: no overrides (white-translucent card + default light
          // text is already correct).
          ...(!isDark && {
            color: "#ffffff",
            "--mui-palette-text-primary": "#ffffff",
            "--mui-palette-text-secondary": "rgba(255, 255, 255, 0.72)",
            "--mui-palette-text-disabled": "rgba(255, 255, 255, 0.5)",
            "--mui-palette-divider": "rgba(255, 255, 255, 0.3)",
            // Paper-based surfaces (Q&A Accordions, carousel frames) default
            // to white in light mode — opaque white strips inside the dark
            // card. Let the translucent card surface show through instead.
            "--mui-palette-background-paper": "transparent",
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/**
 * Restores the theme's default light-mode surface + text colors inside a
 * SectionCard, for Paper-based surfaces that should keep the classic
 * white-with-dark-text MUI look in light mode (the Q&A Accordion). Values
 * derive from `getDesignTokens('light')` so they stay in sync with theme.ts.
 * Apply in LIGHT mode only.
 */
export const sectionCardLightSurfaceSx: SxProps = {
  color: lightText?.primary ?? "#16161f",
  "--mui-palette-text-primary": lightText?.primary ?? "#16161f",
  "--mui-palette-text-secondary": lightText?.secondary ?? "#55556a",
  "--mui-palette-text-disabled": "rgba(0, 0, 0, 0.38)",
  "--mui-palette-divider": lightPalette?.divider ?? "rgba(22, 22, 31, 0.14)",
  "--mui-palette-background-paper": lightBackground?.paper ?? "#ffffff",
};
