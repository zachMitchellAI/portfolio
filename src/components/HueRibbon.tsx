import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

export interface HueRibbonProps {
  /** Ribbon thickness in px. */
  height?: number;
  /** Horizontal skew in degrees, applied via `transform: skewX`. */
  slope?: number;
  /** Alpha for the ribbon (0–1); the fill itself stays opaque. */
  opacity?: number;
}

/**
 * Decorative full-width section divider. A transparent, skewed rectangle whose
 * hue sweeps through ROYGBIV with page scroll progress (0% red → 50% green →
 * 100% violet). The scroll listener updates the background color directly via a
 * ref, so scrolling never triggers a React re-render.
 */
export default function HueRibbon({
  height = 8,
  slope = -20,
  opacity = 0.7,
}: HueRibbonProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ribbon = ribbonRef.current;
    if (!ribbon) return;

    let lastHue = -1;

    const applyHue = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const hue = Math.round(Math.min(Math.max(progress, 0), 1) * 300);
      if (hue === lastHue) return;
      lastHue = hue;
      const saturation = isLight ? '85%' : '70%';
      const lightness = isLight ? '42%' : '50%';
      ribbon.style.backgroundColor = `hsl(${hue} ${saturation} ${lightness})`;
    };

    // Paint the initial color (red at the top of the page) before any scroll.
    applyHue();

    window.addEventListener('scroll', applyHue, { passive: true });
    return () => window.removeEventListener('scroll', applyHue);
  }, [isLight]);

  return (
    <div
      ref={ribbonRef}
      aria-hidden="true"
      style={{
        height,
        opacity,
        // Oversized + negative offset so the skew never exposes gaps at the
        // edges. `pointer-events: none` keeps the overflow inert.
        width: '140%',
        marginLeft: '-20%',
        transform: `skewX(${slope}deg)`,
        pointerEvents: 'none',
      }}
    />
  );
}