import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useColorMode } from "./ColorModeProvider";

import type { VantaEffect, VantaFactory } from "vanta/dist/vanta.net.min";

// Vanta's UMD bundle captures THREE from the global scope while the module is
// being evaluated (`window.THREE`), so the npm three namespace must already be
// on `window.THREE` before the effect module is imported. That import is done
// lazily inside useEffect, which guarantees this assignment runs first.
if (typeof window !== "undefined" && !window.THREE) {
  window.THREE = THREE;
}

// Hex colors as numbers (0xRRGGBB) — that is what Vanta options expect.
const PALETTE = {
  dark: { backgroundColor: 0x202020, color: 0x276cbb },
  light: { backgroundColor: 0xe8e8e8, color: 0x276cbb },
} as const;

/**
 * Fixed full-screen animated NET background rendered behind all page content
 * (z-index -1). pointer-events: none keeps every click/scroll on the page.
 */
export default function Background() {
  // `useTheme().palette.mode` is NOT reactive on the cssVariables/colorSchemes
  // theme (it keeps the value resolved at theme creation), so the reactive
  // color-mode context is used instead — it re-renders on toggle + OS changes.
  const { resolvedMode } = useColorMode();
  const mode: "light" | "dark" = resolvedMode ?? "light";
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let effect: VantaEffect | null = null;

    // Lazy import: keeps three+vanta out of the initial chunk and, critically,
    // guarantees the `window.THREE` assignment above has run before the UMD
    // module evaluates. The module stays cached, so re-running this effect on
    // a theme (mode) change resolves immediately.
    import("vanta/dist/vanta.net.min")
      .then((mod) => {
        if (disposed) {
          // Destroyed before the module finished loading (React StrictMode
          // double-mount in dev) — bail out instead of leaking a canvas.
          return;
        }
        // Module shape differs between bundlers: the UMD wrapper exports the
        // factory as `{ default: factoryFn }`, which dev pre-bundling may hand
        // through as the default (vs. the factory itself in prod interop).
        const candidate: VantaFactory | { default: VantaFactory } | undefined =
          mod.default;
        const factory: VantaFactory | null =
          typeof candidate === "function"
            ? candidate
            : typeof candidate?.default === "function"
              ? candidate.default
              : null;
        if (!factory) {
          throw new TypeError(
            "[Background] could not resolve Vanta NET factory (unexpected module interop shape)",
          );
        }
        effect = factory({
          el: container,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          points: 12,
          maxDistance: 22,
          spacing: 18,
          showDots: true,
          ...PALETTE[mode],
        });

        // Post-init line recolor: vanta's NET line material is created with
        // `vertexColors: THREE.VertexColors`, which three.js removed (r125+),
        // so lines ignore vertex colors and render the material's default
        // white. Its hardcoded additive blending also washes lines out on a
        // light background. Fix both deterministically after init (this runs
        // on every init, including re-inits on mode change).
        const scene = (effect as { scene?: THREE.Scene | null }).scene;
        scene?.traverse((obj) => {
          const line = obj as THREE.LineSegments;
          if (!line.isLineSegments) return;
          const material = line.material as THREE.LineBasicMaterial;
          material.vertexColors = false;
          material.color.set(PALETTE[mode].color);
          // Additive washes out on the light background; normal keeps the blue.
          material.blending =
            mode === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
          material.needsUpdate = true;
        });
      })
      .catch((error: unknown) => {
        // Module load/WebGL failure: the container keeps its solid background
        // color so the page remains usable; surface the cause in the console.
        console.warn("[Background] Vanta NET failed to initialize:", error);
      });

    // Cleanup is mandatory: React 19 StrictMode double-mounts effects in dev.
    return () => {
      disposed = true;
      effect?.destroy();
      effect = null;
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        // Solid fallback visible before the canvas mounts (matches the effect
        // background so there is no flash on theme switch).
        backgroundColor: mode === "dark" ? "#202020" : "#e8e8e8",
      }}
    />
  );
}
