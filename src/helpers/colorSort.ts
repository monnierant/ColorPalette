import type { ColorEntry, SortMode } from '../types/color'
import { rgbToHsl, rgbToLab } from './colorSpaces'

const sorters: Record<SortMode, (a: ColorEntry, b: ColorEntry) => number> = {
  hue: (a, b) => rgbToHsl(a.rgb).h - rgbToHsl(b.rgb).h,
  saturation: (a, b) => rgbToHsl(b.rgb).s - rgbToHsl(a.rgb).s,
  lightness: (a, b) => rgbToHsl(b.rgb).l - rgbToHsl(a.rgb).l,
  red: (a, b) => b.rgb.r - a.rgb.r,
  green: (a, b) => b.rgb.g - a.rgb.g,
  blue: (a, b) => b.rgb.b - a.rgb.b,
  'lab-l': (a, b) => rgbToLab(b.rgb).l - rgbToLab(a.rgb).l,
  'lab-a': (a, b) => rgbToLab(b.rgb).a - rgbToLab(a.rgb).a,
  'lab-b': (a, b) => rgbToLab(b.rgb).b - rgbToLab(a.rgb).b,
}

export const sortColors = (colors: ColorEntry[], mode: SortMode): ColorEntry[] =>
  [...colors].sort(sorters[mode])
