import { createSignal, Show } from "solid-js";
import type { Component } from "solid-js";
import type { ColorEntry } from "../types/color";
import { quantizeLut } from "../helpers/lutQuantize";

interface Props {
  palette: ColorEntry[];
}

const LutRemapper: Component<Props> = (props) => {
  const [dragging, setDragging] = createSignal(false);
  const [processing, setProcessing] = createSignal(false);
  const [resultUrl, setResultUrl] = createSignal<string | null>(null);
  const [sourceUrl, setSourceUrl] = createSignal<string | null>(null);

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    setProcessing(true);
    setResultUrl(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const quantized = quantizeLut(imageData, props.palette);

      const outCanvas = document.createElement("canvas");
      outCanvas.width = quantized.width;
      outCanvas.height = quantized.height;
      const outCtx = outCanvas.getContext("2d")!;
      outCtx.putImageData(quantized, 0, 0);

      outCanvas.toBlob((blob) => {
        if (blob) {
          const prev = resultUrl();
          if (prev) URL.revokeObjectURL(prev);
          setResultUrl(URL.createObjectURL(blob));
        }
        setProcessing(false);
      }, "image/png");
    };
    img.src = url;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file?.type.startsWith("image/")) processFile(file);
  };

  const handleChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) processFile(file);
  };

  const handleDownload = () => {
    const url = resultUrl();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "lut-remapped.png";
    a.click();
  };

  return (
    <div class="lut-remapper">
      <label
        class={`uploader${dragging() ? " dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <path d="M7 2v20" />
          <path d="M17 2v20" />
          <path d="M2 7h20" />
          <path d="M2 12h20" />
          <path d="M2 17h20" />
        </svg>
        <span>Drop a LUT image or click to browse</span>
        <input type="file" accept="image/*" hidden onChange={handleChange} />
      </label>

      <Show when={processing()}>
        <p class="lut-status">Processing…</p>
      </Show>

      <Show when={sourceUrl() && resultUrl()}>
        <div class="lut-preview">
          <div class="lut-preview-col">
            <h3>Original</h3>
            <img src={sourceUrl()!} alt="Original LUT" class="lut-image" />
          </div>
          <div class="lut-preview-col">
            <h3>Remapped</h3>
            <img src={resultUrl()!} alt="Remapped LUT" class="lut-image" />
          </div>
        </div>
        <button class="export-btn lut-download-btn" onClick={handleDownload}>
          Download remapped LUT
        </button>
      </Show>
    </div>
  );
};

export default LutRemapper;
