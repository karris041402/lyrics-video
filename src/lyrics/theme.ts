export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const DISPLAY = '"Arial Black", Impact, "Helvetica Neue", Arial, sans-serif';
export const LIGHT = '"Segoe UI Light", "Helvetica Neue", Helvetica, Arial, sans-serif';

export type Palette = { bg: string; fg: string; accent: string; dim: string };

/** Font size that keeps `text` within maxW (cw = avg glyph width in em). */
export const fit = (text: string, maxW: number, maxSize: number, cw = 0.8) =>
  Math.min(maxSize, maxW / (Math.max(1, text.length) * cw));
