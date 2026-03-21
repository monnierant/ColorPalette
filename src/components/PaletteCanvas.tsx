import { createEffect, createSignal, For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import type { ColorEntry } from '../types/color'
import { drawPalette, drawPaletteStrip } from '../helpers/paletteImage'

export type PaletteLayout = 'grid' | 'strip'
export type BlendMode = 'srgb' | 'lab'

const BLEND_MODES: BlendMode[] = ['srgb', 'lab']

interface Props {
  colors: ColorEntry[]
  layout: PaletteLayout
  onLayoutChange: (l: PaletteLayout) => void
}

const PaletteCanvas: Component<Props> = (props) => {
  let canvas!: HTMLCanvasElement
  const [swatchSize, setSwatchSize] = createSignal(28)
  const [blend, setBlend] = createSignal(7)
  const [blendMode, setBlendMode] = createSignal<BlendMode>('srgb')

  createEffect(() => {
    if (blend() > swatchSize()) setBlend(swatchSize())
  })

  createEffect(() => {
    if (props.colors.length === 0) return
    if (props.layout === 'strip') drawPaletteStrip(canvas, props.colors, swatchSize(), blend(), blendMode())
    else drawPalette(canvas, props.colors, 48)
  })

  const handleExportPng = () => {
    const url = canvas.toDataURL('image/png')
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'palette-strip.png'
    anchor.click()
  }

  return (
    <div>
      <div class="palette-layout-toggle">
        <button
          class={props.layout === 'grid' ? 'active' : ''}
          onClick={() => props.onLayoutChange('grid')}
          title="Grid view"
        >
          ▦ Grid
        </button>
        <button
          class={props.layout === 'strip' ? 'active' : ''}
          onClick={() => props.onLayoutChange('strip')}
          title="Strip view"
        >
          ▬ Strip
        </button>
        <Show when={props.layout === 'strip' && props.colors.length > 0}>
          <div class="strip-params">
            <div class="strip-blend-modes">
              <span class="strip-param-label">Blend</span>
              <div class="strip-blend-toggle">
                <For each={BLEND_MODES}>
                  {(mode) => (
                    <button
                      class={blendMode() === mode ? 'active' : ''}
                      onClick={() => setBlendMode(mode)}
                    >
                      {mode.toUpperCase()}
                    </button>
                  )}
                </For>
              </div>
            </div>
            <label class="strip-param">
              <span>Swatch size</span>
              <input
                type="number"
                min="4"
                max="200"
                value={swatchSize()}
                onInput={(e) => setSwatchSize(Math.max(4, parseInt(e.currentTarget.value) || 4))}
              />
            </label>
            <label class="strip-param strip-param--blend">
              <span>Blend — {blend()}</span>
              <input
                type="range"
                min="0"
                max={swatchSize()}
                value={blend()}
                onInput={(e) => setBlend(parseInt(e.currentTarget.value))}
              />
            </label>
          </div>
          <button class="export-btn" onClick={handleExportPng} title="Export PNG">
            ↓ Export PNG
          </button>
        </Show>
      </div>
      <div class="palette-canvas-wrap">
        <canvas ref={canvas} class={`palette-canvas${props.layout === 'strip' ? ' palette-canvas--strip' : ''}`} />
      </div>
    </div>
  )
}

export default PaletteCanvas
