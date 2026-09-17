import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import { assetUrl } from '../utils/assetUrl';
import type { PortfolioData } from '../types';

export interface IntroProps {
  /** Full site data (shared fetch from ticket 00) — this section reads `data.intro`. */
  data: PortfolioData;
}

/**
 * Hero/intro section: profile picture + header + body + bullet list.
 * All content comes from `data.intro` (PortfolioData contract) — the
 * component holds zero personal content text.
 *
 * Layout: side-by-side from `md` up (avatar left, text right),
 * single column on mobile with the avatar stacking first.
 */
export default function Intro({ data }: IntroProps) {
  const { intro } = data;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, width: '100%' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 4, md: 6 }}
        sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}
      >
        <Avatar
          variant="circular"
          src={assetUrl('pfp.png')}
          alt="Profile picture"
          sx={{
            width: 160,
            height: 160,
            flexShrink: 0,
            border: 1,
            borderColor: 'divider',
            // Shown while the image is missing/loading (onError fallback):
            fontSize: '5rem',
            bgcolor: 'action.hover',
          }}
        >
          <PersonIcon />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h2" component="h2">
            {intro.header}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {intro.body}
          </Typography>

          <List disablePadding sx={{ mt: 2 }}>
            {intro['bullet-points'].map((point) => (
              <ListItem key={point} disablePadding sx={{ py: 0.5, alignItems: 'flex-start' }}>
                <CircleIcon
                  sx={{
                    fontSize: 10,
                    mt: '7px',
                    mr: 2,
                    flexShrink: 0,
                    color: 'text.secondary',
                  }}
                />
                <ListItemText primary={point} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>
    </Box>
  );
}
