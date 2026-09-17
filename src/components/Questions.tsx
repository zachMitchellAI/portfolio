import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HueRibbon from './HueRibbon';
import type { PortfolioData } from '../types';

export interface QuestionsProps {
  /** Portfolio JSON — only `data.questions` is consumed. */
  data: PortfolioData;
}

/**
 * "Q & A" section: one MUI Accordion per `data.questions` entry. Controlled
 * state (`expanded` index, `null` = all closed, the default) keeps at most
 * one entry open at a time. All copy comes from the JSON — nothing is
 * hardcoded here.
 */
export default function Questions({ data }: QuestionsProps) {
  const [expanded, setExpanded] = React.useState<number | null>(null);

  const handleChange =
    (index: number) =>
    (_event: React.SyntheticEvent, isExpanded: boolean): void => {
      setExpanded(isExpanded ? index : null);
    };

  return (
    <Box component="section" aria-label="Q & A">
      <HueRibbon />
      <Typography variant="h3" component="h3" sx={{ mb: 2 }}>
        Q &amp; A
      </Typography>
      <Stack spacing={1} sx={{ maxWidth: 720, mx: 'auto' }}>
        {data.questions.map((qa, index) => (
          <Accordion
            key={`${index}-${qa.q}`}
            expanded={expanded === index}
            onChange={handleChange(index)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{qa.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{qa.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}
