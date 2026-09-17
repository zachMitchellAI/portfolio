/**
 * Ambient types for the `vanta` package, which ships no official types.
 *
 * We consume the pre-built per-effect UMD bundle directly
 * (`vanta/dist/vanta.net.min`) because the package's `main` entry
 * (`src/_base.js`) only exposes the shared base — not the NET effect —
 * so only the import path we actually use is declared here.
 *
 * NOTE: this file must stay a script (no top-level imports/exports) so the
 * `declare module` block is an ambient declaration rather than an
 * augmentation. The three namespace is referenced via a type-position import.
 *
 * The bundle reads THREE off the global scope while it is being evaluated
 * (`window.THREE`), which is why `Window.THREE` is augmented for the
 * pre-import assignment done in `src/components/Background.tsx`.
 */

declare module 'vanta/dist/vanta.net.min' {
  export interface VantaEffect {
    destroy: () => void
    // The effect instance exposes its THREE.Scene after init (used by
    // Background.tsx to recolor the line materials post-construction).
    scene?: import('three').Scene
  }

  export interface VantaNetOptions {
    el: HTMLElement
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    color?: number
    backgroundColor?: number
    backgroundAlpha?: number
    points?: number
    maxDistance?: number
    spacing?: number
    showDots?: boolean
  }

  export type VantaFactory = (options: VantaNetOptions) => VantaEffect

  // The pre-built UMD wrapper exports the factory as `module.exports = { default: factoryFn }`,
  // and bundler interop (dev pre-bundle vs production build) may or may not unwrap that
  // object, so the resolved default is either the factory itself or an object wrapping it.
  const NET: VantaFactory | { default: VantaFactory }
  export default NET
}

// Global augmentation (script-scope `interface` merge, no `declare global`
// needed since this file is not a module).
interface Window {
  THREE?: typeof import('three')
}
