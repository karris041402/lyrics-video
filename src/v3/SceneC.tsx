import React from "react";
import { AbsoluteFill } from "remotion";
import { lines, Word } from "../lyrics/data";
import { clamp01, easeInOut, easeOut, useOnset, useT } from "../lyrics/motion";
import { accentAt, BODY, FONT_BODY, HERO_KEYS, INK } from "../v2/tokens";
import { FIN_HERO, HeroX, OnlyOn, sum, UI, UIHERO, win } from "./kit";

const FONT = '"Segoe UI", "Segoe UI Emoji", Arial, sans-serif';

/* =============== S5 — notifications, lines 19-22 (people's opinions get swiped away) =============== */

const N_LINES = lines.slice(18, 22);
const CARD_W = 1280;
const CARD_H = 300;
const STEP_Y = 340;
const CUR_Y = 650;
const SWIPE = lines[21].words[4].start; // "di" of "di bale na"

const NWord: React.FC<{ w: Word; accent: string }> = ({ w, accent }) => {
  const { since, active } = useOnset(w);
  const k = easeOut(clamp01(since / 0.22));
  return <span style={{ display: "inline-block", fontFamily: FONT_BODY, fontSize: UI, lineHeight: "64px", color: active ? accent : INK, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>{w.word}</span>;
};

const NRow: React.FC<{ ws: Word[]; accent: string }> = ({ ws, accent }) =>
  ws.length ? (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {ws.map((w, i) => (
        <OnlyOn key={i} w={w}>
          <NWord w={w} accent={accent} />
        </OnlyOn>
      ))}
    </div>
  ) : null;

const Card: React.FC<{ k: number; idx: number; accent: string }> = ({ k, idx, accent }) => {
  const t = useT();
  const line = N_LINES[k];
  const s = line.words[0].start;
  const e = easeOut(win(t, s - 0.15, s + 0.4));
  if (e <= 0) return null;
  const d = idx - k;
  const t0 = k < N_LINES.length - 1 ? SWIPE + k * 0.1 : line.words[line.words.length - 1].end - 0.45;
  const sw = win(t, t0, t0 + 0.5);
  const out = sw * sw;
  if (out >= 1) return null;
  const hk = HERO_KEYS[line.index][0];
  const y = CUR_Y - d * STEP_Y;
  const op = (d > 2.4 ? 0 : 1 - Math.max(0, d) * 0.28) * e;
  const tf = `translate3d(${out * 2300}px, ${y - CARD_H / 2 - (1 - e) * 520}px, ${-d * 90}px) rotateX(${-(1 - e) * 55 + d * 3}deg) rotateZ(${out * 14}deg) scale(${1 - d * 0.035})`;
  return (
    <div style={{ position: "absolute", left: 960 - CARD_W / 2, top: 0, width: CARD_W, height: CARD_H, opacity: op, transform: tf, transformOrigin: "50% 0%", background: "linear-gradient(180deg, rgba(34,38,58,0.96), rgba(22,25,40,0.96))", border: "1.5px solid rgba(255,255,255,0.14)", borderRadius: 52, boxShadow: "0 40px 90px rgba(0,0,0,0.5)", padding: "26px 52px 46px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontSize: 26, color: "#8b92a6", height: 34 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: accent }} />
        <span style={{ fontWeight: 700, letterSpacing: "0.04em" }}>REAL</span>
        <span style={{ marginLeft: "auto" }}>now</span>
      </div>
      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
        <NRow ws={line.words.slice(0, hk)} accent={accent} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
          <OnlyOn w={line.words[hk]}>
            <HeroX w={line.words[hk]} face={accent} size={UIHERO} depth={24} rest={-10} />
          </OnlyOn>
          <div style={{ marginBottom: 6 }}>
            <NRow ws={line.words.slice(hk + 1)} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dots: React.FC = () => {
  const t = useT();
  const a = 49.4;
  const b = 50.7;
  if (t < a || t >= b) return null;
  const e = easeOut(win(t, a, a + 0.25)) * (1 - win(t, b - 0.15, b));
  return (
    <div style={{ position: "absolute", left: 960 - CARD_W / 2 + 40, top: CUR_Y + CARD_H / 2 + 40, display: "flex", gap: 12, background: "#2b2e3a", borderRadius: 40, padding: "22px 30px", opacity: e, transform: `translateY(${(1 - e) * 24}px) rotateX(${(1 - e) * 40}deg)` }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 16, height: 16, borderRadius: 16, background: "#aab0c0", opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 8 - i * 0.9)) }} />
      ))}
    </div>
  );
};

export const S5: React.FC = () => {
  const t = useT();
  const accent = accentAt(t);
  const idx = sum(N_LINES.length, (k) => {
    const s = N_LINES[k].words[0].start;
    return easeInOut(win(t, s - 0.15, s + 0.4));
  });
  return (
    <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 40%" }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(${6 + Math.sin(t * 0.6) * 1.2}deg) rotateY(${-8 + Math.sin(t * 0.5) * 3}deg)` }}>
        {N_LINES.map((_, k) => (
          <Card key={k} k={k} idx={idx} accent={accent} />
        ))}
        <Dots />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =============== S6 — finale, line 23 =============== */

export const S6: React.FC = () => {
  const t = useT();
  const accent = accentAt(t);
  const w = lines[22].words;
  const k = easeInOut(win(t, 53.0, 57.2));
  const sent = easeOut(win(t, 55.6, 55.9));
  return (
    <AbsoluteFill style={{ perspective: 1700, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateY(${-22 + k * 30 + Math.sin(t * 0.9) * 2}deg) rotateX(${4}deg) scale(${1 + 0.1 * k})`, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <OnlyOn w={w[0]}>
          <BastaWord w={w[0]} />
        </OnlyOn>
        <div style={{ display: "flex", gap: 120 }}>
          <HeroX w={w[1]} face={accent} size={FIN_HERO} depth={70} rest={-12} open={false} />
          <HeroX w={w[2]} face={accent} size={FIN_HERO} depth={70} rest={-12} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 30, color: "#8b92a6", opacity: sent, transform: `translateY(${(1 - sent) * 14}px)` }}>✓ Sent</div>
    </AbsoluteFill>
  );
};

const BastaWord: React.FC<{ w: Word }> = ({ w }) => {
  const { since } = useOnset(w);
  const k = easeOut(clamp01(since / 0.3));
  return <div style={{ fontFamily: FONT_BODY, fontSize: BODY, lineHeight: 1.1, color: INK, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>{w.word}</div>;
};
