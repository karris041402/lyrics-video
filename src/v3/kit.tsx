import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Line, Word } from "../lyrics/data";
import { pulse } from "../lyrics/beat";
import { clamp01, easeInOut, easeOut, useOnset, useT } from "../lyrics/motion";
import { Extrude } from "../v2/Hero";
import { accentAt, BG, BODY, CH, COL_W, CW, FONT_BODY, FONT_HERO, HERO, HERO_KEYS, INK } from "../v2/tokens";

/** Type scale. World text: BODY/HERO (v2). Text inside phone UI: UI/UIHERO. Finale hero is the single exception. */
export const UI = 52;
export const UIHERO = 96;
export const FIN_HERO = 300;

export const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const sum = (n: number, f: (k: number) => number) => {
  let v = 0;
  for (let k = 1; k < n; k++) v += f(k);
  return v;
};

/* ---------- Stage: a scene that enters and leaves with a 3D move, never a fade-only cut ---------- */
export type Kind = "none" | "left" | "right" | "rise" | "through" | "deep";

/** q: 0 = at rest, 1 = fully away. */
const move = (kind: Kind, q: number): { tf: string; op: number } => {
  switch (kind) {
    case "left":
      return { tf: `translateX(${-q * 1500}px) rotateY(${q * 55}deg)`, op: 1 };
    case "right":
      return { tf: `translateX(${q * 1500}px) rotateY(${-q * 55}deg)`, op: 1 };
    case "rise":
      return { tf: `translateY(${q * 1200}px) rotateX(${-q * 40}deg)`, op: 1 };
    case "through":
      return { tf: `scale(${1 + q * 2.6})`, op: 1 - q * q };
    case "deep":
      return { tf: `scale(${1 - q * 0.55})`, op: 1 - q };
    default:
      return { tf: "", op: 1 };
  }
};

export const Stage: React.FC<{ inA: number; inB: number; outA: number; outB: number; enter?: Kind; exit?: Kind; children: React.ReactNode }> = ({
  inA,
  inB,
  outA,
  outB,
  enter = "none",
  exit = "none",
  children,
}) => {
  const t = useT();
  if (t < inA || t >= outB) return null;
  const qi = 1 - easeInOut(win(t, inA, inB));
  const qo = easeInOut(win(t, outA, outB));
  const a = move(enter, qi);
  const b = move(exit, qo);
  return (
    <AbsoluteFill style={{ transform: `perspective(1800px) ${a.tf} ${b.tf}`, opacity: a.op * b.op }}>{children}</AbsoluteFill>
  );
};

/* ---------- persistent backdrop ---------- */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const PARTS = Array.from({ length: 34 }, (_, i) => ({ x: rnd(i + 1) * CW, y0: rnd(i + 50) * CH, v: 10 + rnd(i + 90) * 26, r: 2 + rnd(i + 130) * 3, ph: rnd(i + 170) * 6.28, z: rnd(i + 210) }));

/** Persistent backdrop. Layers: glow, drifting orbs, slow rings, rising dust, light sweep, dot grid. All low contrast. */
export const Backdrop: React.FC = () => {
  const t = useT();
  const accent = accentAt(t);
  const pl = pulse(t);
  const boost = 1 + 1.6 * win(t, 53.28, 54.3);
  const sweep = ((t % 11) / 11) * 1.4 - 0.2;
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(1000px 760px at ${14 + 6 * Math.sin(t * 0.3)}% 95%, ${accent}, transparent 70%)`, opacity: (0.13 + 0.03 * pl) * boost }} />
      <AbsoluteFill style={{ background: "radial-gradient(800px 600px at 88% 5%, #7b6cff, transparent 70%)", opacity: 0.1 }} />
      {[0, 1, 2].map((i) => {
        const x = CW * (0.5 + 0.42 * Math.sin(t * (0.11 + i * 0.05) + i * 2.1));
        const y = CH * (0.5 + 0.38 * Math.cos(t * (0.09 + i * 0.04) + i * 1.3));
        return <div key={i} style={{ position: "absolute", left: x - 360, top: y - 360, width: 720, height: 720, borderRadius: 720, background: `radial-gradient(closest-side, ${i === 1 ? "#7b6cff" : accent}, transparent)`, opacity: 0.07 + 0.012 * pl }} />;
      })}
      <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
        {[420, 640, 880].map((r, i) => (
          <circle key={r} cx={1560} cy={300} r={r * (1 + 0.012 * pl)} fill="none" stroke={accent} strokeOpacity={0.1 - i * 0.025} strokeWidth={2} strokeDasharray={`${40 + i * 30} ${60 + i * 40}`} strokeDashoffset={t * (14 + i * 9) * (i % 2 ? -1 : 1)} />
        ))}
      </svg>
      {PARTS.map((p, i) => {
        const y = (((p.y0 - t * p.v) % (CH + 40)) + CH + 40) % (CH + 40);
        const x = p.x + Math.sin(t * 0.4 + p.ph) * 22 * (0.4 + p.z);
        return <div key={i} style={{ position: "absolute", left: x, top: y - 20, width: p.r, height: p.r, borderRadius: p.r, background: "#fff", opacity: 0.1 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.3 + p.ph)) * (0.4 + p.z * 0.6) }} />;
      })}
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep * 100 - 14}%, rgba(255,255,255,0.045) ${sweep * 100}%, transparent ${sweep * 100 + 14}%)` }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 2px)", backgroundSize: "56px 56px", backgroundPosition: `${-t * 16}px ${t * 9}px` }} />
    </AbsoluteFill>
  );
};

/* ---------- words ---------- */
/** Body word. Before its onset it shows as a dim preview if ghost > 0. */
export const Wd: React.FC<{ w: Word; accent: string; ghost?: number; size?: number }> = ({ w, accent, ghost = 0, size = BODY }) => {
  const { on, since, active } = useOnset(w);
  const k = on ? easeOut(clamp01(since / 0.25)) : 0;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_BODY,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
        color: active ? accent : INK,
        opacity: ghost + (1 - ghost) * k,
        transform: `translateY(${(1 - k) * 26}px)`,
        filter: on && k < 1 ? `blur(${(1 - k) * 8}px)` : undefined,
      }}
    >
      {w.word}
    </span>
  );
};

/** Extruded hero word, parametrised by size. */
export const HeroX: React.FC<{ w: Word; face: string; size: number; depth?: number; rest?: number; open?: boolean }> = ({ w, face, size, depth = 34, rest = -14, open = true }) => {
  const { p, on, t, since, dur } = useOnset(w);
  const sway = Math.sin(t * 1.1 + w.start) * 3;
  const hold = clamp01(since / Math.min(dur, 1.6));
  return (
    <div style={{ visibility: on ? "visible" : "hidden" }}>
      <Extrude text={w.word} size={size} face={face} ry={rest + sway - (1 - p) * 70} rx={5} z={-(1 - p) * 320} opacity={clamp01(p * 3)} tracking={-0.02 + (open ? 0.03 * easeOut(hold) : 0)} depth={depth} />
    </div>
  );
};

/** Hero with an optional flat dim preview before its onset (keeps layout stable). */
export const HeroG: React.FC<{ w: Word; accent: string; ghost?: number }> = ({ w, accent, ghost = 0 }) => {
  const { on } = useOnset(w);
  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontFamily: FONT_HERO, fontSize: HERO, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: "-0.02em", color: INK, opacity: on ? 0 : ghost }}>{w.word}</div>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <HeroX w={w} face={accent} size={HERO} />
      </div>
    </div>
  );
};

const Row: React.FC<{ words: Word[]; accent: string; ghost: number; center?: boolean }> = ({ words, accent, ghost, center }) =>
  words.length ? (
    <div style={{ display: "flex", flexWrap: words.reduce((n, w) => n + w.word.length + 1, 0) <= 28 ? "nowrap" : "wrap", whiteSpace: "nowrap", gap: "6px 26px", justifyContent: center ? "center" : undefined }}>
      {words.map((w, i) => (
        <Wd key={i} w={w} accent={accent} ghost={ghost} />
      ))}
    </div>
  ) : null;

/** One lyric line in the v2 layout: body above, hero, body after. */
export const Plane: React.FC<{ line: Line; accent: string; ghost?: number; center?: boolean; extra?: React.ReactNode; fx?: (w: Word, node: React.ReactNode) => React.ReactNode }> = ({ line, accent, ghost = 0, center, extra, fx }) => {
  const keys = HERO_KEYS[line.index];
  const first = keys[0];
  const last = keys[keys.length - 1];
  return (
    <div style={{ position: "relative", width: COL_W, height: CH, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: center ? "center" : undefined, gap: 14 }}>
      {extra}
      <Row words={line.words.slice(0, first)} accent={accent} ghost={ghost} center={center} />
      <div style={{ display: "flex", gap: 40, justifyContent: center ? "center" : undefined }}>
        {keys.map((k) => {
          const node = <HeroG w={line.words[k]} accent={accent} ghost={ghost} />;
          return <React.Fragment key={k}>{fx ? fx(line.words[k], node) : node}</React.Fragment>;
        })}
      </div>
      <Row words={line.words.slice(last + 1)} accent={accent} ghost={ghost} center={center} />
    </div>
  );
};

/** Renders only once the word is sung, so a bubble/card grows as the line is sung. */
export const OnlyOn: React.FC<{ w: Word; children: React.ReactNode }> = ({ w, children }) => {
  const { on } = useOnset(w);
  return on ? <>{children}</> : null;
};

/** Meme "sent as a photo" in the chat language: rounded photo card with a seen avatar, springs in on a hero word. */
export const MemeCard: React.FC<{ src: string; w: Word; left: number; top: number; size: number; tilt: number }> = ({ src, w, left, top, size, tilt }) => {
  const { p, on, t, since } = useOnset(w);
  if (!on) return null;
  const k = easeOut(clamp01(since / 0.45));
  const bob = Math.sin(t * 1.4 + w.start) * 8;
  return (
    <div style={{ position: "absolute", left, top: top + bob + (1 - k) * 120, width: size, height: size, transform: `perspective(1000px) rotateY(${-16 + Math.sin(t * 0.8) * 5 + (1 - p) * 60}deg) rotateZ(${tilt + (1 - k) * -10}deg) scale(${0.55 + 0.45 * Math.min(p, 1.08)})`, opacity: clamp01(p * 2.5), transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: -14, borderRadius: 54, background: "linear-gradient(160deg,#1f8bff,#9a4dff)", opacity: 0.55, filter: "blur(30px)" }} />
      <Img src={staticFile(src)} style={{ position: "relative", width: size, height: size, objectFit: "cover", borderRadius: 40, border: "6px solid #f5f6fa", boxShadow: "0 30px 70px rgba(0,0,0,0.55)" }} />
      <div style={{ position: "absolute", right: -14, bottom: -14, width: 44, height: 44, borderRadius: 44, background: "linear-gradient(135deg,#7aa7ff,#b58cff)", border: "4px solid #0d0f1a", transform: `scale(${easeOut(clamp01((since - 0.5) / 0.25))})` }} />
    </div>
  );
};
