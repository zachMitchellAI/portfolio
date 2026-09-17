import { useEffect, useLayoutEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { useColorMode } from "./ColorModeProvider";

export interface HueRibbonProps {
  /** Band thickness in px (the visible diagonal stroke). */
  height?: number;
  /** Vertical shear in degrees, applied via `transform: skewY`; negative rises to the right. */
  slope?: number;
  /** Alpha for the ribbon (0–1); the fill itself stays opaque. */
  opacity?: number;
  /** Constant hue shift in degrees, added to the scroll-driven hue (wrapped into 0–359). */
  hueOffset?: number;
}

/**
 * Decorative full-bleed section divider: a thick diagonal band rising to the
 * right (skewY) that runs corner-to-corner of the viewport (bottom-left →
 * top-right). Its hue sweeps through ROYGBIV with page scroll progress
 * (0% red → 50% green → 100% violet). The scroll listener updates the
 * background color directly via a ref, so scrolling never triggers a React
 * re-render.
 */
export default function HueRibbon({
  height = 72,
  slope = -17,
  opacity = 0.7,
  hueOffset = 0,
}: HueRibbonProps) {
  const { resolvedMode } = useColorMode();
  const isLight = (resolvedMode ?? "light") === "light";
  const frameRef = useRef<HTMLDivElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  // Viewport-center the 100vw frame with a computed pixel margin so the
  // ribbon is full-bleed from ANY nesting depth, regardless of parent
  // alignment (centered column, left-aligned article, flex Stack — all the
  // same). Recomputed on window resize; idempotent, so StrictMode
  // double-invocation is safe.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const align = () => {
      const rect = frame.getBoundingClientRect();
      const targetLeft =
        (document.documentElement.clientWidth - rect.width) / 2;
      const current = parseFloat(frame.style.marginLeft) || 0;
      frame.style.marginLeft = `${current + (targetLeft - rect.left)}px`;
    };

    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, []);

  // Vertical rise of the shear per unit width: with a frame of height
  // tan(|slope|) × 100vw + band height, the band's left end sits flush at the
  // frame's bottom-left and its right end exits exactly at the frame's
  // top-right — the full diagonal is visible, never clipped, at every width.
  const tanFactor = Math.tan((Math.abs(slope) * Math.PI) / 180).toFixed(4);

  useEffect(() => {
    const ribbon = ribbonRef.current;
    if (!ribbon) return;

    let lastHue = -1;

    const applyHue = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const raw =
        Math.round(Math.min(Math.max(progress, 0), 1) * 300) + hueOffset;
      // Wrap into 0–359 so offsets (including negatives) can't escape the HSL range.
      const hue = ((raw % 360) + 360) % 360;
      if (hue === lastHue) return;
      lastHue = hue;
      const saturation = isLight ? "85%" : "70%";
      const lightness = isLight ? "42%" : "50%";
      ribbon.style.backgroundColor = `hsl(${hue} ${saturation} ${lightness})`;
    };

    // Paint the initial color (red at the top of the page) before any scroll.
    applyHue();

    window.addEventListener("scroll", applyHue, { passive: true });
    return () => window.removeEventListener("scroll", applyHue);
  }, [isLight, hueOffset]);

  return (
    // Clip frame: participates in normal document flow (it IS the section
    // divider) and is full-bleed: 100vw wide, viewport-centered by a
    // computed pixel margin (see the layout effect below — percentage
    // escapes are unusable here: `margin-left: %` misresolves inside flex
    // parents, and inset-% approaches assume a centered parent).
    // `overflow: 'hidden'` clips the skewed band to the corner-to-corner
    // frame.
    <Box
      aria-hidden="true"
      ref={frameRef}
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: `calc(${tanFactor} * 100vw + ${height}px)`,
        marginTop: "-10vw",
        zIndex: -1,
      }}
    >
      <div
        ref={ribbonRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          // 100% of the 100vw frame is already edge-to-edge (skewY does not
          // affect horizontal extent). `pointer-events: none` keeps the band
          // inert over content.
          width: "100%",
          marginLeft: 0,
          height,
          opacity,
          transform: `skewY(${slope}deg)`,
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
