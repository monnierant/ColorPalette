import type { ColorEntry } from '../types/color'
import { rgbToHex } from './colorSpaces'

const QUANTIZE_STEP = 12
const MAX_COLORS = 128
const SAMPLE_STEP = 2

const quantize = (v: number): number =>
  Math.min(255, Math.round(v / QUANTIZE_STEP) * QUANTIZE_STEP)

export const extractColors = (imageData: ImageData): ColorEntry[] => {
  const { data, width, height } = imageData
  const counts = new Map<string, { r: number; g: number; b: number; count: number }>()

  for (let y = 0; y < height; y += SAMPLE_STEP) {
    for (let x = 0; x < width; x += SAMPLE_STEP) {
      const i = (y * width + x) * 4
      if (data[i + 3] < 128) continue // skip transparent pixels

      const r = quantize(data[i])
      const g = quantize(data[i + 1])
      const b = quantize(data[i + 2])
      const key = `${r},${g},${b}`

      const entry = counts.get(key)
      if (entry) entry.count++
      else counts.set(key, { r, g, b, count: 1 })
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_COLORS)
    .map(({ r, g, b, count }) => ({
      rgb: { r, g, b },
      hex: rgbToHex({ r, g, b }),
      count,
    }))
}
