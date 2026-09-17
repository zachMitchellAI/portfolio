import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { PortfolioData, TechItem } from "../types";
import { assetUrl } from "../utils/assetUrl";
import { useColorMode } from "./ColorModeProvider";

/**
 * Fixed pixel height shared by every icon slot, so all cards line up
 * regardless of each logo's intrinsic aspect ratio.
 */
const ICON_HEIGHT = 48;

/**
 * Tech icons whose artwork is monochrome black and therefore vanishes on the
 * dark background — e.g. nextjs.svg (devicon) paints its circle black.
 * Colored brand icons (js/ts/react/node/vite/bun/langchain/mui/tanstack) are
 * NOT listed here and render untouched in both modes.
 */
const DARK_ICONS = new Set(["/techstack/nextjs.svg"]);

/** Hover grow easing (material-standard bezier) — see ticket 05. */
const HOVER_TRANSITION = "transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)";

interface TechCardProps {
  item: TechItem;
}

/**
 * One clickable tech card. Keeps its own `failed` flag so a missing/broken
 * icon silently degrades to the dashed-border placeholder instead of
 * rendering a broken-image glyph or crashing.
 */
function TechCard({ item }: TechCardProps) {
  const [failed, setFailed] = React.useState(false);
  // Dark-mode contrast: invert black-only icons (see DARK_ICONS). Read the
  // mode reactively via useColorMode() — useTheme().palette.mode is not
  // reactive on the CSS-vars theme.
  const { resolvedMode } = useColorMode();
  const isDark = (resolvedMode ?? "light") === "dark";
  // Empty path (ticket 10 not merged yet) also falls back to the placeholder.
  const src = item["img-src"] ? assetUrl(item["img-src"]) : null;
  const showImage = src !== null && !failed;
  const invertIcon =
    isDark && item["img-src"] !== null && DARK_ICONS.has(item["img-src"]);

  const handleError = () => setFailed(true);

  return (
    <Box
      component="a"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.name}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        height: "100%",
        p: 1.5,
        borderRadius: 2,
        border: "2px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        color: "inherit",
        textAlign: "center",
        textDecoration: "none",
        transition: HOVER_TRANSITION,
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Box
        sx={{
          height: ICON_HEIGHT,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showImage ? (
          <Box
            component="img"
            src={src ?? undefined}
            alt={item.name}
            loading="lazy"
            onError={handleError}
            sx={{
              height: ICON_HEIGHT,
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
              filter: invertIcon ? "invert(1)" : "none",
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              maxWidth: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              overflow: "hidden",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" noWrap>
              {item.name}
            </Typography>
          </Box>
        )}
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        sx={{ maxWidth: "100%" }}
      >
        {item.name}
      </Typography>
    </Box>
  );
}

export interface TechStackProps {
  /** Portfolio JSON — only `data['tech-stack']` is consumed. */
  data: PortfolioData;
}

/**
 * "Tech Stack" section: uniform grid of tech icons. Each card opens the
 * technology's official site in a new tab and grows ~5% on hover.
 */
export default function TechStack({ data }: TechStackProps) {
  const items = data["tech-stack"];

  return (
    <Box component="section" aria-label="Tech Stack">
      <Typography variant="h3" component="h3" sx={{ mb: 2 }}>
        Tech Stack
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid
            key={`${item.name}-${item["img-src"]}`}
            size={{ xs: 4, sm: 3, md: 2 }}
          >
            <TechCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
