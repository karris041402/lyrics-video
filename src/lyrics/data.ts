import raw from "../../assets/real_lyrics_aligned.json";
import { Palette } from "./theme";

export type Word = { word: string; start: number; end: number };
export type Line = {
  id: string;
  index: number;
  text: string;
  words: Word[];
  /** Presentation window (seconds). Derived only from word timings. */
  showFrom: number;
  showTo: number;
};
export type Section = Palette & {
  id: "hook" | "verseA" | "verseB" | "verseC" | "finale";
  lines: [number, number]; // 1-based inclusive
  wipe: "none" | "up" | "left" | "diag" | "cut";
  wipeStart: number;
  wipeDur: number;
};

export const DURATION_S: number = raw.audio_duration_seconds;
const WIPE_DUR = 0.22;
const WIPE_LEAD = 0.24;

type Def = Omit<Section, "wipeStart" | "wipeDur">;
const DEFS: Def[] = [
  { id: "hook", lines: [1, 8], bg: "#0a0a0a", fg: "#ffffff", accent: "#ffe14d", dim: "#6b6b73", wipe: "none" },
  { id: "verseA", lines: [9, 14], bg: "#f2efe8", fg: "#0a0a0a", accent: "#e5262b", dim: "#9a968c", wipe: "up" },
  { id: "verseB", lines: [15, 18], bg: "#16123f", fg: "#ffffff", accent: "#b9a2ff", dim: "#6d66a8", wipe: "left" },
  { id: "verseC", lines: [19, 22], bg: "#050505", fg: "#ffffff", accent: "#3d8bff", dim: "#5a5f6e", wipe: "cut" },
  { id: "finale", lines: [23, 23], bg: "#ffe14d", fg: "#0a0a0a", accent: "#e5262b", dim: "#8a7a1e", wipe: "diag" },
];

const src = raw.lyrics as { id: string; text: string; words: Word[] }[];

export const lines: Line[] = src.map((l, i) => {
  const words = l.words.map((w) => ({ word: w.word, start: w.start, end: w.end }));
  const next = src[i + 1];
  const lastEnd = words[words.length - 1].end;
  let showTo: number;
  if (!next) showTo = DURATION_S - 0.5;
  else {
    const nextStart = next.words[0].start;
    showTo = nextStart - lastEnd < 0.5 ? nextStart : Math.min(lastEnd + 0.5, nextStart - 0.1);
  }
  return { id: l.id, index: i + 1, text: l.text, words, showFrom: words[0].start - 0.03, showTo };
});

export const sections: Section[] = DEFS.map((d) => {
  const first = lines[d.lines[0] - 1];
  const w0 = first.words[0].start;
  const cut = d.wipe === "cut" || d.wipe === "none";
  return {
    ...d,
    wipeStart: cut ? first.showFrom : w0 - WIPE_LEAD,
    wipeDur: cut ? 0 : WIPE_DUR,
  };
});

// A wipe must not cut the previous line's sung words.
sections.forEach((s, i) => {
  if (i === 0 || s.wipe === "cut") return;
  const prev = lines[s.lines[0] - 2];
  prev.showTo = Math.min(prev.showTo, s.wipeStart);
});

export const sectionOfLine = (index: number) =>
  sections.find((s) => index >= s.lines[0] && index <= s.lines[1])!;

/** Timing conflicts found in the aligned JSON; reported, never repaired. */
export const timingConflicts = src.flatMap((l, i) => {
  const out: string[] = [];
  const last = l.words[l.words.length - 1];
  if (i > 0) {
    const pe = src[i - 1].words[src[i - 1].words.length - 1].end;
    if (l.words[0].start < pe - 1e-6) out.push(`${l.id}: starts ${l.words[0].start} before previous line's last word ends ${pe}`);
  }
  l.words.forEach((w) => {
    if (w.end - w.start < 0.03) out.push(`${l.id}: "${w.word}" duration ${(w.end - w.start).toFixed(2)}s`);
  });
  if (last.end > DURATION_S) out.push(`${l.id}: beyond audio duration`);
  return out;
});
