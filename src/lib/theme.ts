// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * The site's theme palette. `COLOR_DEFAULTS` is the fallback; admins can override
 * these in the PlatformSettings global, and the active values are emitted as the
 * `--method-*` CSS custom properties used throughout the frontend styles.
 */
export interface MethodensammlungColors {
  methodMain: string
  methodLight: string
  methodVeryLight: string
  methodAccent: string
  methodDark: string
  ink: string
  inkAccent: string
  white: string
  whiteTransparent: string
  black: string
}

export const COLOR_DEFAULTS: MethodensammlungColors = {
  methodMain:      '#a0a2e8',
  methodLight:     '#d8d9ff',
  methodVeryLight: '#eeeeff',
  methodAccent:    '#7375c4',
  methodDark:      '#4b4d9e',
  ink:             '#555555',
  inkAccent:       '#1c1c1c', // = rgb(28, 28, 28)
  white:           '#ffffff',
  whiteTransparent:'rgba(255, 255, 255, 0.7)',
  black:           '#000000',
}

/**
 * Subset of platform-settings fields that override brand/text colors.
 * White, transparent-white and black stay fixed at COLOR_DEFAULTS.
 */
export interface ColorSettings {
  colorMethodMain?: string | null
  colorMethodLight?: string | null
  colorMethodVeryLight?: string | null
  colorMethodAccent?: string | null
  colorMethodDark?: string | null
  colorInk?: string | null
  colorInkAccent?: string | null
}

/** Merge admin overrides with defaults; empty/missing fields fall back. */
export function resolveColors(s: ColorSettings | null | undefined): MethodensammlungColors {
  const pick = (v: string | null | undefined, fallback: string) =>
    typeof v === 'string' && v.trim() !== '' ? v.trim() : fallback

  return {
    ...COLOR_DEFAULTS,
    methodMain:      pick(s?.colorMethodMain, COLOR_DEFAULTS.methodMain),
    methodLight:     pick(s?.colorMethodLight, COLOR_DEFAULTS.methodLight),
    methodVeryLight: pick(s?.colorMethodVeryLight, COLOR_DEFAULTS.methodVeryLight),
    methodAccent:    pick(s?.colorMethodAccent, COLOR_DEFAULTS.methodAccent),
    methodDark:      pick(s?.colorMethodDark, COLOR_DEFAULTS.methodDark),
    ink:             pick(s?.colorInk, COLOR_DEFAULTS.ink),
    inkAccent:       pick(s?.colorInkAccent, COLOR_DEFAULTS.inkAccent),
  }
}

export function colorsToCssVars(c: MethodensammlungColors): string {
  return `
    --method: ${c.methodMain};
    --method-light: ${c.methodLight};
    --method-very-light: ${c.methodVeryLight};
    --method-accent: ${c.methodAccent};
    --method-dark: ${c.methodDark};
    --method-ink: ${c.ink};
    --method-ink-accent: ${c.inkAccent};
    --method-white: ${c.white};
    --method-white-transparent: ${c.whiteTransparent};
    --method-black: ${c.black};
    --method-border: ${c.methodLight};
    --method-on-brand: ${c.inkAccent};
  `.trim()
}
