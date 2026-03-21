import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

interface Props {
  onImageLoad: (imageData: ImageData, url: string) => void
}

const ImageUploader: Component<Props> = (props) => {
  const [dragging, setDragging] = createSignal(false)

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      props.onImageLoad(ctx.getImageData(0, 0, img.width, img.height), url)
    }
    img.src = url
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files[0]
    if (file?.type.startsWith('image/')) processFile(file)
  }

  const handleChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) processFile(file)
  }

  return (
    <label
      class={`uploader${dragging() ? ' dragging' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span>Drop a palette image or click to browse</span>
      <input type="file" accept="image/*" hidden onChange={handleChange} />
    </label>
  )
}

export default ImageUploader
