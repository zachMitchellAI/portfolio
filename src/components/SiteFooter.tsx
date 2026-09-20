import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SocialsMap } from "../types";
import Socials from "./Socials";

export interface SiteFooterProps {
  /** The `socials` map straight from the portfolio JSON. */
  socials: SocialsMap;
}

/**
 * Page footer: centered social links above a small copyright line.
 */
export default function SiteFooter({ socials }: SiteFooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        py: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" color="text.secondary">
        Let's stay in touch!
      </Typography>
      <Socials socials={socials} />
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Zach
      </Typography>
    </Box>
  );
}
