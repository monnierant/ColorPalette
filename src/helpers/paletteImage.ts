import type { ColorEntry } from '../types/color'
import Color from "colorjs.io";



const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const drawPalette = (canvas: HTMLCanvasElement, colors: ColorEntry[], swatchSize: number): void => {
  const cols = Math.ceil(Math.sqrt(colors.length))
  const rows = Math.ceil(colors.length / cols)
  canvas.width = cols * swatchSize
  canvas.height = rows * swatchSize

  const ctx = canvas.getContext('2d')!
  colors.forEach(({ rgb }, i) => {
    const x = (i % cols) * swatchSize
    const y = Math.floor(i / cols) * swatchSize
    ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`
    ctx.fillRect(x, y, swatchSize, swatchSize)
  })
}

export const drawPaletteStrip = (canvas: HTMLCanvasElement, colors: ColorEntry[], swatchSize: number, blend: number, mode: "srgb" | "lab" = "srgb") => {
  if (colors.length === 0) return
  canvas.width = colors.length * swatchSize
  canvas.height = swatchSize

  const ctx = canvas.getContext('2d')!

  colors.forEach(({ rgb }, i) => {
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`
      if (i == 0) {
        ctx.fillRect(i * swatchSize, 0, swatchSize - blend, swatchSize)
      }
      else if (i == colors.length -1) {
        ctx.fillRect(i * swatchSize + blend, 0, swatchSize - blend, swatchSize)
      }
      else {
      ctx.fillRect(i * swatchSize + blend, 0, swatchSize - blend * 2, swatchSize)
      }
      for(var n = 0; n < 2 * blend; n++) {
        if (i === colors.length - 1) break;
        ctx.fillStyle = blendColors(colors[i], colors[i + 1], n / (2*blend), mode);
        ctx.fillRect(i * swatchSize + swatchSize - blend + n, 0, 1, swatchSize)
      }
    })
}

function blendColors(a: ColorEntry, b: ColorEntry, t: number, mode: "srgb" | "lab" = "srgb") {
  const ca = new Color(`rgb(${a.rgb.r} ${a.rgb.g} ${a.rgb.b})`)
  const cb = new Color(`rgb(${b.rgb.r} ${b.rgb.g} ${b.rgb.b})`)

  const c = ca.mix(cb, t, { space: mode, outputSpace: "srgb" })
  return c.toString()
}

