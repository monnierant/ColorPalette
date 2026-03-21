import { For } from 'solid-js'
import type { Component } from 'solid-js'
import type { SortMode } from '../types/color'

const GROUPS: { label: string; modes: { value: SortMode; label: string }[] }[] = [
  {
    label: 'HSL',
    modes: [
      { value: 'hue', label: 'Hue' },
      { value: 'saturation', label: 'Saturation' },
      { value: 'lightness', label: 'Lightness' },
    ],
  },
  {
    label: 'RGB',
    modes: [
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
    ],
  },
  {
    label: 'LAB',
    modes: [
      { value: 'lab-l', label: 'L' },
      { value: 'lab-a', label: 'A' },
      { value: 'lab-b', label: 'B' },
    ],
  },
]

interface Props {
  mode: SortMode
  onChange: (mode: SortMode) => void
}

const SortControls: Component<Props> = (props) => (
  <div class="sort-controls">
    <For each={GROUPS}>
      {({ label, modes }) => (
        <div class="sort-group">
          <span class="sort-group-label">{label}</span>
          <For each={modes}>
            {({ value, label: btnLabel }) => (
              <button
                class={props.mode === value ? 'active' : ''}
                onClick={() => props.onChange(value)}
              >
                {btnLabel}
              </button>
            )}
          </For>
        </div>
      )}
    </For>
  </div>
)

export default SortControls
