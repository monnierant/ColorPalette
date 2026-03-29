import type { RGB, ColorEntry } from "../types/color";
import { rgbToLab, deltaE76 } from "./colorSpaces";
import type { Lab } from "./colorSpaces";

interface PaletteLab {
  lab: Lab;
  rgb: RGB;
}

const buildPaletteLab = (palette: ColorEntry[]): PaletteLab[] =>
  palette.map((entry) => ({
    lab: rgbToLab(entry.rgb),
    rgb: entry.rgb,
  }));

const findClosestColor = (pixelLab: Lab, paletteLab: PaletteLab[]): RGB => {
  let bestDistance = Infinity;
  let bestRgb = paletteLab[0].rgb;

  for (let i = 0; i < paletteLab.length; i++) {
    const distance = deltaE76(pixelLab, paletteLab[i].lab);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestRgb = paletteLab[i].rgb;
    }
  }

  return bestRgb;
};

export const quantizeLut = (
  imageData: ImageData,
  palette: ColorEntry[],
): ImageData => {
  const paletteLab = buildPaletteLab(palette);
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  const out = output.data;

  const cache = new Map<number, RGB>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    if (alpha < 128) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      continue;
    }

    const key = (r << 16) | (g << 8) | b;
    let closest = cache.get(key);

    if (!closest) {
      const lab = rgbToLab({ r, g, b });
      closest = findClosestColor(lab, paletteLab);
      cache.set(key, closest);
    }

    out[i] = closest.r;
    out[i + 1] = closest.g;
    out[i + 2] = closest.b;
    out[i + 3] = 255;
  }

  return output;
};
