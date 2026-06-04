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
  inkAccent:       'rgb(28, 28, 28)',
  white:           '#ffffff',
  whiteTransparent:'rgba(255, 255, 255, 0.7)',
  black:           '#000000',
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
  `.trim()
}
