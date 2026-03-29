import { createMemo, createSignal, Show } from "solid-js";
import type { Component } from "solid-js";
import "./app.css";
import type { ColorEntry, SortMode } from "./types/color";
import { extractColors } from "./helpers/colorExtraction";
import { sortColors } from "./helpers/colorSort";
import ImageUploader from "./components/ImageUploader";
import SortControls from "./components/SortControls";
import ColorGrid from "./components/ColorGrid";
import PaletteCanvas, { type PaletteLayout } from "./components/PaletteCanvas";
import LutRemapper from "./components/LutRemapper";

const App: Component = () => {
  const [colors, setColors] = createSignal<ColorEntry[]>([]);
  const [sortMode, setSortMode] = createSignal<SortMode>("hue");
  const [imageUrl, setImageUrl] = createSignal<string | null>(null);
  const [paletteLayout, setPaletteLayout] = createSignal<PaletteLayout>("grid");

  const sorted = createMemo(() => sortColors(colors(), sortMode()));

  const handleImageLoad = (imageData: ImageData, url: string) => {
    setImageUrl(url);
    setColors(extractColors(imageData));
  };

  return (
    <div class="app">
      <header>
        <h1>Color Palette Extractor</h1>
        <p>
          Upload a palette image — extract, sort by color space, reconstruct.
        </p>
      </header>

      <main>
        <ImageUploader onImageLoad={handleImageLoad} />

        <Show when={imageUrl()}>
          <section>
            <h2>Source image</h2>
            <img src={imageUrl()!} alt="Source palette" class="source-image" />
          </section>
        </Show>

        <Show when={colors().length > 0}>
          <section>
            <h2>Sort by color space</h2>
            <SortControls mode={sortMode()} onChange={setSortMode} />
          </section>

          <section>
            <h2>Extracted colors — {colors().length}</h2>
            <ColorGrid colors={sorted()} />
          </section>

          <section>
            <h2>Reconstructed palette</h2>
            <PaletteCanvas
              colors={sorted()}
              layout={paletteLayout()}
              onLayoutChange={setPaletteLayout}
            />
          </section>

          <section>
            <h2>Remap a LUT to this palette</h2>
            <LutRemapper palette={sorted()} />
          </section>
        </Show>
      </main>
    </div>
  );
};

export default App;
