import { For } from 'solid-js'
import type { Component } from 'solid-js'
import type { ColorEntry } from '../types/color'
import { rgbToHsb, rgbToLab } from '../helpers/colorSpaces'

interface Props {
  colors: ColorEntry[]
}

const ColorGrid: Component<Props> = (props) => (
  <div class="color-grid">
    <For each={props.colors}>
      {({ hex, rgb }) => {
        const hsb = rgbToHsb(rgb)
        const lab = rgbToLab(rgb)
        const tooltip = [
          hex.toUpperCase(),
          `RGB  R: ${rgb.r}  G: ${rgb.g}  B: ${rgb.b}`,
          `HSB  H: ${Math.round(hsb.h * 360)}°  S: ${Math.round(hsb.s * 100)}%  B: ${Math.round(hsb.b * 100)}%`,
          `LAB  L: ${lab.l.toFixed(1)}  A: ${lab.a.toFixed(1)}  B: ${lab.b.toFixed(1)}`,
        ].join('\n')
        return (
          <div
            class="swatch"
            style={{ background: hex }}
            title={tooltip}
          />
        )
      }}
    </For>
  </div>
)

export default ColorGrid
