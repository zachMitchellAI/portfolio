import { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles'
import * as THREE from 'three'

import type { VantaEffect } from 'vanta/dist/vanta.net.min'

// Vanta's UMD bundle captures THREE from the global scope while the module is
// being evaluated (`window.THREE`), so the npm three namespace must already be
// on `window.THREE` before the effect module is imported. That import is done
// lazily inside useEffect, which guarantees this assignment runs first.
if (typeof window !== 'undefined' && !window.THREE) {
  window.THREE = THREE
}

// Hex colors as numbers (0xRRGGBB) — that is what Vanta options expect.
const PALETTE = {
  dark: { backgroundColor: 0x0a0a12, color: 0x3a7bd5 },
  light: { backgroundColor: 0xf4f6fa, color: 0x2a4a7f },
} as const

/**
 * Fixed full-screen animated NET background rendered behind all page content
 * (z-index -1). pointer-events: none keeps every click/scroll on the page.
 */
export default function Background() {
  const mode = useTheme().palette.mode
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let effect: VantaEffect | null = null

    // Lazy import: keeps three+vanta out of the initial chunk and, critically,
    // guarantees the `window.THREE` assignment above has run before the UMD
    // module evaluates. The module stays cached, so re-running this effect on
    // a theme (mode) change resolves immediately.
    import('vanta/dist/vanta.net.min')
      .then((mod) => {
        if (disposed) {
          // Destroyed before the module finished loading (React StrictMode
          // double-mount in dev) — bail out instead of leaking a canvas.
          return
        }
        effect = mod.default({
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
        })
      })
      .catch((error: unknown) => {
        // Module load/WebGL failure: the container keeps its solid background
        // color so the page remains usable; surface the cause in the console.
        console.warn('[Background] Vanta NET failed to initialize:', error)
      })

    // Cleanup is mandatory: React 19 StrictMode double-mounts effects in dev.
    return () => {
      disposed = true
      effect?.destroy()
      effect = null
    }
  }, [mode])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        // Solid fallback visible before the canvas mounts (matches the effect
        // background so there is no flash on theme switch).
        backgroundColor: mode === 'dark' ? '#0a0a12' : '#f4f6fa',
      }}
    />
  )
}
