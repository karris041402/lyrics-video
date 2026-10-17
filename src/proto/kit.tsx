import React from "react";
import { AbsoluteFill, random } from "remotion";
import { pulse } from "../lyrics/beat";
import { Word } from "../lyrics/data";
import { clamp01, easeInOut, easeOut, useOnset, useT } from "../lyrics/motion";

export const CW = 1920;
export const CH = 1080;
export const BLACK_FONT = '"Segoe UI Black", "Segoe UI", Arial, sans-serif';
export const BOLD_FONT = '"Segoe UI Semibold", "Segoe UI", Arial, sans-serif';
export const REG_FONT = '"Segoe UI", Arial, sans-serif';

/** Horizontal-only gaussian blur = motion smear. Filter lives next to the element. */
export const HBlur: React.FC<{ id: string; std: number }> = ({ id, std }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-40%" width="180%" y="-10%" height="120%">
      <feGaussianBlur stdDeviation={`${Math.max(0, std)} 0`} />
    </filter>
  </svg>
);

type PWProps = {
  w: Word;
  x: number;
  y: number;
  size: number;
  font?: string;
  color: string;
  /** direction the word whips in from: -1 left, 1 right, 0 none */
  dir?: number;
  smear?: number;
  opacity?: number;
  stroke?: string;
  extra?: React.CSSProperties;
  text?: string;
};

/** A positioned lyric word that whips in with a horizontal smear on its aligned onset. */
export const PW: React.FC<PWProps> = ({ w, x, y, size, font = BLACK_FONT, color, dir = 1, smear = 90, opacity = 1, stroke, extra, text }) => {
  const { on, since } = useOnset(w);
  if (!on) return null;
  const e = easeOut(clamp01(since / 0.3));
  const id = `hb-${w.start}-${x}-${y}`;
  return (
    <>
      <HBlur id={id} std={(1 - e) * smear} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          fontFamily: font,
          fontSize: size,
          lineHeight: 1,
          whiteSpace: "nowrap",
          letterSpacing: "-0.02em",
          color: stroke ? "transparent" : color,
          WebkitTextStroke: stroke ? `3px ${stroke}` : undefined,
          opacity: opacity * clamp01(since / 0.05 + 0.15),
          transform: `translateX(${(1 - e) * dir * 260}px)`,
          filter: (1 - e) * smear > 0.5 ? `url(#${id})` : undefined,
          ...extra,
        }}
      >
        {text ?? w.word}
      </div>
    </>
  );
};

/** Free-floating ovals, the "o" particles of the reference. Beat-pulsed. */
export const Ovals: React.FC<{ color: string; count?: number; speed?: number; seed?: string }> = ({ color, count = 16, speed = 26, seed = "o" }) => {
  const t = useT();
  const pl = pulse(t);
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }, (_, i) => {
        const depth = random(`${seed}d${i}`);
        const r = 10 + depth * 38;
        const x = random(`${seed}x${i}`) * CW + Math.sin(t * 0.6 + i) * 16 * depth;
        const y = (((random(`${seed}y${i}`) * CH - t * speed * (0.3 + depth)) % CH) + CH) % CH;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={r * (1 + pl * 0.12)}
            ry={r * 0.72 * (1 + pl * 0.12)}
            transform={`rotate(${random(`${seed}r${i}`) * 80 - 40} ${x} ${y})`}
            fill="none"
            stroke={color}
            strokeWidth={2 + depth * 4}
            strokeOpacity={0.25 + depth * 0.55}
            style={{ filter: depth < 0.3 ? "blur(3px)" : undefined }}
          />
        );
      })}
    </svg>
  );
};

/** A stroke that draws itself, so it can pass through lettering. */
export const Curve: React.FC<{ d: string; progress: number; color: string; width?: number; opacity?: number }> = ({ d, progress, color, width = 7, opacity = 1 }) => (
  <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - clamp01(progress)} opacity={opacity} />
  </svg>
);

export const wavePath = (x0: number, x1: number, y: number, amp: number, wl: number, phase = 0) => {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 20) pts.push(`${x === x0 ? "M" : "L"}${x},${(y + Math.sin(x / wl + phase) * amp).toFixed(1)}`);
  return pts.join(" ");
};

export type Wipe = { kind: "right" | "left" | "down" | "up" | "circle" | "diag"; start: number; dur: number; cx?: number; cy?: number };

const clipFor = (wipe: Wipe | undefined, p: number) => {
  if (!wipe) return undefined;
  switch (wipe.kind) {
    case "right":
      return `inset(0 0 0 ${(1 - p) * 100}%)`;
    case "left":
      return `inset(0 ${(1 - p) * 100}% 0 0)`;
    case "down":
      return `inset(0 0 ${(1 - p) * 100}% 0)`;
    case "up":
      return `inset(${(1 - p) * 100}% 0 0 0)`;
    case "diag": {
      const x = p * 140;
      return `polygon(0 0, ${x}% 0, ${x - 40}% 100%, 0 100%)`;
    }
    default:
      return `circle(${p * 2400}px at ${wipe.cx ?? CW / 2}px ${wipe.cy ?? CH / 2}px)`;
  }
};

/** One continuous set: background, wipe-in, and its own camera move. */
export const SceneSet: React.FC<{
  from: number;
  to: number;
  bg: string;
  wipe?: Wipe;
  camera?: (ts: number) => { s?: number; x?: number; y?: number; r?: number };
  children: React.ReactNode;
  under?: React.ReactNode;
}> = ({ from, to, bg, wipe, camera, children, under }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const p = wipe ? easeInOut(clamp01((t - wipe.start) / wipe.dur)) : 1;
  const c = camera ? camera(t - from) : {};
  const pl = pulse(t);
  return (
    <AbsoluteFill style={{ background: bg, clipPath: clipFor(wipe, p), overflow: "hidden" }}>
      {under}
      <AbsoluteFill
        style={{
          transform: `translate(${c.x ?? 0}px, ${c.y ?? 0}px) rotate(${c.r ?? 0}deg) scale(${(c.s ?? 1) * (1 + pl * 0.01)})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
