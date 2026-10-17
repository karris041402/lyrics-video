import { Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "./data";

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Global song time in seconds (the video never uses nested Sequences). */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Per-word clock keyed to the aligned onset. p = spring 0..~1.1 since onset. */
export const useOnset = (w: Word) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = frame - Math.round(w.start * fps);
  const p =
    f < 0
      ? 0
      : spring({ frame: f, fps, config: { damping: 13, stiffness: 240, mass: 0.5 } });
  return {
    t,
    p,
    on: f >= 0,
    active: t >= w.start && t < w.end,
    sung: t >= w.end,
    since: Math.max(0, t - w.start),
    dur: Math.max(0.01, w.end - w.start),
  };
};
