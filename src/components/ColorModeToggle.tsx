import IconButton from '@mui/material/IconButton';
import type { IconButtonProps } from '@mui/material/IconButton';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useColorMode } from './ColorModeProvider';

type ColorModeToggleProps = Omit<IconButtonProps, 'onClick' | 'aria-label'>;

/**
 * Color-mode icon button for header/footer use. Follows the MUI docs
 * convention: the icon shows the mode you get after clicking (moon in light
 * mode, sun in dark mode).
 */
export function ColorModeToggle(props: ColorModeToggleProps) {
  const { resolvedMode, toggleColorMode } = useColorMode();
  const isDark = resolvedMode === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <IconButton {...props} color="inherit" onClick={toggleColorMode} aria-label={label} title={label}>
      {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
    </IconButton>
  );
}

export default ColorModeToggle;
