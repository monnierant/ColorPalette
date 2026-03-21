import type { RGB } from '../types/color'

export const rgbToHex = ({ r, g, b }: RGB): string =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')

export const rgbToHsl = ({ r, g, b }: RGB) => {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h, s, l }
}

export const rgbToHsb = ({ r, g, b }: RGB): { h: number; s: number; b: number } => {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const brightness = max
  const saturation = max === 0 ? 0 : (max - min) / max
  let hue = 0
  if (max !== min) {
    const d = max - min
    if (max === rn) hue = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) hue = ((bn - rn) / d + 2) / 6
    else hue = ((rn - gn) / d + 4) / 6
  }
  return { h: hue, s: saturation, b: brightness }
}

export const getLuminance = ({ r, g, b }: RGB): number => {
  const lin = (c: number) => {
    const n = c / 255
    return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export const rgbToLab = ({ r, g, b }: RGB): { l: number; a: number; b: number } => {
  const lin = (c: number) => {
    const n = c / 255
    return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  const rl = lin(r), gl = lin(g), bl = lin(b)
  const x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047
  const y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) / 1.00000
  const z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883
  const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116
  const fx = f(x), fy = f(y), fz = f(z)
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}
