import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import type { SocialsMap } from "../types";
import { assetUrl } from "../utils/assetUrl";
import { useColorMode } from "./ColorModeProvider";

export interface SocialsProps {
  /** The `socials` map straight from the portfolio JSON. */
  socials: SocialsMap;
}

/**
 * Fallback glyph for a social whose icon asset failed to load: GitHub for
 * github slugs, LinkedIn for linked-in slugs, and a generic globe otherwise.
 */
function fallbackGlyph(key: string) {
  const normalized = key.toLowerCase();
  if (normalized.includes("github")) return <GitHubIcon />;
  if (normalized.includes("linkedin") || normalized.includes("linked-in")) {
    return <LinkedInIcon />;
  }
  return <LanguageOutlinedIcon />;
}

interface SocialLinkButtonProps {
  slug: string;
  icon: string;
  link: string;
}

/**
 * One social icon button. Keeps its own `failed` flag so a missing/broken
 * icon silently degrades to a matching MUI glyph instead of rendering a
 * broken-image glyph or crashing (same pattern as TechStack's TechCard).
 */
function SocialLinkButton({ slug, icon, link }: SocialLinkButtonProps) {
  const [failed, setFailed] = useState(false);
  // Social glyphs are monochrome brand glyphs with no explicit fill (they
  // default to black), so they vanish on the dark background — invert them
  // to white in dark mode. Read reactively via useColorMode() because
  // useTheme().palette.mode is not reactive on the CSS-vars theme.
  const { resolvedMode } = useColorMode();
  const isDark = (resolvedMode ?? "light") === "dark";

  return (
    <IconButton
      component="a"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={slug}
      title={slug}
      color="inherit"
    >
      {failed ? (
        fallbackGlyph(slug)
      ) : (
        <Box
          component="img"
          src={assetUrl(icon)}
          alt=""
          height={24}
          width={24}
          onError={() => setFailed(true)}
          sx={{ display: "block", filter: isDark ? "invert(1)" : "none" }}
        />
      )}
    </IconButton>
  );
}

/**
 * Plug-and-play row of social links: iterates `Object.entries(socials)`, so
 * adding a 4th JSON entry (or removing one) Just Works with no per-entry
 * code and uniform spacing throughout.
 */
export default function Socials({ socials }: SocialsProps) {
  const entries = Object.entries(socials);
  if (entries.length === 0) return null;

  return (
    <Stack direction="row" spacing={1}>
      {entries.map(([slug, entry]) => (
        <SocialLinkButton
          key={`${slug}:${entry.icon}`}
          slug={slug}
          icon={entry.icon}
          link={entry.link}
        />
      ))}
    </Stack>
  );
}
