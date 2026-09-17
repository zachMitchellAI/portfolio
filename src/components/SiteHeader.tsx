import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { SocialsMap } from "../types";
import Socials from "./Socials";
import ColorModeToggle from "./ColorModeToggle";

export interface SiteHeaderProps {
  /** The `socials` map straight from the portfolio JSON. */
  socials: SocialsMap;
}

/**
 * Sticky page header: site name on the left, social links + color-mode
 * toggle on the right. `color="default"` + `enableColorOnDark` keeps the
 * bar background-friendly against the transparent/Vanta page background.
 */
export default function SiteHeader({ socials }: SiteHeaderProps) {
  return (
    <AppBar position="sticky" color="default" enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Zach
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Socials socials={socials} />
        <ColorModeToggle />
      </Toolbar>
    </AppBar>
  );
}
