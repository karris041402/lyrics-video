import { lines } from "../lyrics/data";

export const CW = 1920;
export const CH = 1080;

/** One type scale for the whole video. Nothing else is allowed. */
export const BODY = 96;
export const HERO = 180;
export const FONT_BODY = '"Segoe UI Semibold", "Segoe UI", Arial, sans-serif';
export const FONT_HERO = '"Segoe UI Black", "Segoe UI", Arial, sans-serif';

/** One grid: text column on the left, phone on the right. */
export const COL_X = 140;
export const COL_W = 1150;
export const PHONE_X = 1560;

export const INK = "#f5f6fa";
export const BG = "#0d0f1a";

/** Which word indexes of each line are the hero(es). Everything else is body. */
export const HERO_KEYS: Record<number, number[]> = {
  1: [3], 2: [4], 3: [2], 4: [4], 5: [3], 6: [4], 7: [2], 8: [4],
  9: [6], 10: [4], 11: [3], 12: [3], 13: [3], 14: [1],
  15: [6], 16: [3], 17: [1], 18: [2],
  19: [1], 20: [5], 21: [5], 22: [1], 23: [1, 2],
};

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, k: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`;
};
export const darken = (c: string, k: number) => mix(c, "#000000", k);

/** Accent shifts at section starts (line 9, 15, 19, 23), crossfading over 0.35s. */
const ACCENTS: [number, string][] = [
  [0, "#ffd84d"],
  [lines[8].showFrom, "#ff7a6b"],
  [lines[14].showFrom, "#7aa7ff"],
  [lines[18].showFrom, "#5eead4"],
  [lines[22].showFrom, "#ffd84d"],
];
export const accentAt = (t: number) => {
  let i = 0;
  ACCENTS.forEach(([s], k) => {
    if (t >= s - 0.35) i = k;
  });
  if (i === 0) return ACCENTS[0][1];
  const k = Math.min(1, Math.max(0, (t - (ACCENTS[i][0] - 0.35)) / 0.35));
  return k >= 1 ? ACCENTS[i][1] : mix(ACCENTS[i - 1][1], ACCENTS[i][1], k);
};
