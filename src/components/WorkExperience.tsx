import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PortfolioData } from "../types";
import WorkExperienceItem from "./WorkExperienceItem";

export interface WorkExperienceProps {
  data: PortfolioData;
}

/**
 * Section header — the literal copy is mandated by the spec (ticket 07);
 * every other string on the page comes from the JSON data.
 */
const SECTION_HEADER =
  "Here are some things I've done in the past... have a look!";

/**
 * Work-experience section: one ribbon before the header, then a single
 * centered column of items (≥ 64px apart via `spacing={8}`), each rendered by
 * `WorkExperienceItem` with its own ribbon divider.
 */
export default function WorkExperience({ data }: WorkExperienceProps) {
  return (
    <Stack component="section" spacing={3} sx={{ width: "100%", px: 2, py: 6 }}>
      <Box sx={{ width: "100%", maxWidth: 760, mx: "auto" }}>
        <Typography variant="h3" sx={{ textAlign: "left" }}>
          {SECTION_HEADER}
        </Typography>
        <Stack spacing={8} sx={{ mt: 6 }}>
          {data["work-experience"].map((entry) => (
            <WorkExperienceItem key={entry.id} entry={entry} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
