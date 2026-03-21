export interface RGB {
  r: number
  g: number
  b: number
}

export interface ColorEntry {
  rgb: RGB
  hex: string
  count: number
}

export type SortMode =
  | 'hue'
  | 'saturation'
  | 'lightness'
  | 'red'
  | 'green'
  | 'blue'
  | 'lab-l'
  | 'lab-a'
  | 'lab-b'
