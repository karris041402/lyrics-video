import { onsets } from "./beats";

/** 1 on a beat/onset, decaying to 0. Drives pulses, never lyric timing. */
export const pulse = (t: number, decay = 0.14) => {
  let lo = 0;
  let hi = onsets.length - 1;
  let k = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (onsets[m] <= t) {
      k = m;
      lo = m + 1;
    } else hi = m - 1;
  }
  return k < 0 ? 0 : Math.exp(-(t - onsets[k]) / decay);
};
