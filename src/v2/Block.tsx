import React from "react";
import { AbsoluteFill } from "remotion";
import { Line, Word } from "../lyrics/data";
import { clamp01, easeOut, useOnset, useT } from "../lyrics/motion";
import { HeroWord } from "./Hero";
import { BODY, COL_W, COL_X, CH, FONT_BODY, HERO_KEYS, INK } from "./tokens";

const Ctx: React.FC<{ w: Word; accent: string }> = ({ w, accent }) => {
  const { on, since, active } = useOnset(w);
  const k = on ? easeOut(clamp01(since / 0.25)) : 0;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_BODY,
        fontSize: BODY,
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
        color: active ? accent : INK,
        opacity: k,
        transform: `translateY(${(1 - k) * 26}px)`,
        filter: `blur(${(1 - k) * 8}px)`,
      }}
    >
      {w.word}
    </span>
  );
};

const Row: React.FC<{ words: Word[]; accent: string }> = ({ words, accent }) =>
  words.length ? (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 26px" }}>
      {words.map((w, i) => (
        <Ctx key={i} w={w} accent={accent} />
      ))}
    </div>
  ) : null;

/** One lyric line = body words above, hero word(s), body words after. Same place every time. */
export const LineBlock: React.FC<{ line: Line; accent: string }> = ({ line, accent }) => {
  const t = useT();
  if (t < line.showFrom || t >= line.showTo) return null;
  const out = clamp01((t - (line.showTo - 0.12)) / 0.12);
  const keys = HERO_KEYS[line.index];
  const first = keys[0];
  const last = keys[keys.length - 1];
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-18 * out}px)` }}>
      <div style={{ position: "absolute", left: COL_X, top: 0, width: COL_W, height: CH, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
        <Row words={line.words.slice(0, first)} accent={accent} />
        <div style={{ display: "flex", gap: 40 }}>
          {keys.map((k) => (
            <HeroWord key={k} w={line.words[k]} accent={accent} />
          ))}
        </div>
        <Row words={line.words.slice(last + 1)} accent={accent} />
      </div>
    </AbsoluteFill>
  );
};
