import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { WorkExperience } from '../types';
import { assetUrl } from '../utils/assetUrl';
import HueRibbon from './HueRibbon';
import ImageCarousel from './ImageCarousel';

export interface WorkExperienceItemProps {
  /** One `data['work-experience']` entry. */
  entry: WorkExperience;
}

/**
 * The entry `id` slug (e.g. "forms-for-salesforce") is the only name-ish field
 * on a work-experience entry, so the display name is derived from it.
 */
function companyNameFromId(id: string): string {
  return id
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface EntryListProps {
  title: string;
  items: string[];
}

/** Shared bullet-list block ("Product features" / "Personal experience"). */
function EntryList({ title, items }: EntryListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <List sx={{ listStyleType: 'disc', pl: 3 }}>
        {items.map((item, index) => (
          <ListItem
            key={`${item}-${index}`}
            disablePadding
            sx={{ display: 'list-item', py: 0.5 }}
          >
            <Typography variant="body1" component="span">
              {item}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

/**
 * One work-experience entry: ribbon divider, logo (or dashed placeholder),
 * company name, role + dates, description, gallery carousel, and the two
 * bullet lists. All text comes from `entry` — no company content is hardcoded.
 */
export default function WorkExperienceItem({ entry }: WorkExperienceItemProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const companyName = companyNameFromId(entry.id);
  const showLogo = entry.logo.trim().length > 0 && !logoFailed;

  return (
    <Stack
      component="article"
      spacing={2}
      sx={{ width: '100%', maxWidth: 720, textAlign: 'left' }}
    >
      <HueRibbon />
      {showLogo ? (
        <Box
          component="img"
          src={assetUrl(entry.logo)}
          alt={companyName}
          onError={() => setLogoFailed(true)}
          sx={{
            width: { xs: '60%', md: '30%' },
            height: 'auto',
            display: 'block',
          }}
        />
      ) : (
        <Box
          aria-hidden="true"
          sx={{
            width: { xs: '60%', md: '30%' },
            height: 72,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        />
      )}
      <Box>
        <Typography variant="h4">{companyName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {entry.role} · {entry.dates}
        </Typography>
      </Box>
      <Typography variant="body1">{entry.description}</Typography>
      <ImageCarousel images={entry.gallery} />
      <EntryList title="Product features" items={entry['product-features']} />
      <EntryList title="Personal experience" items={entry['personal-experience']} />
    </Stack>
  );
}
