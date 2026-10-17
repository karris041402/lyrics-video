import raw from "../assets/real_lyrics_aligned.json";

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

export const DURATION_S: number = raw.audio_duration_seconds;

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
