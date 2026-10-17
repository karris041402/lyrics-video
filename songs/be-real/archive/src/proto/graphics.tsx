import React from "react";
import { clamp01, easeOut, useT } from "../lyrics/motion";
import { CH, CW } from "./kit";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

type Pose = "idle" | "cross" | "point" | "talk" | "cheer";

/** Hand-drawn (code-drawn) stickman. x,y = feet. look 0..1 = eyes visible, lookX -1..1 = gaze. */
export const Stickman: React.FC<{
  x: number;
  y: number;
  h: number;
  color: string;
  eye: string;
  pose?: Pose;
  look?: number;
  lookX?: number;
  appear?: number;
  rot?: number;
  opacity?: number;
}> = ({ x, y, h, color, eye, pose = "idle", look = 1, lookX = 0, appear = 1, rot = 0, opacity = 1 }) => {
  const sw = h * 0.05;
  const L = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1 * h} y1={y1 * h} x2={x2 * h} y2={y2 * h} stroke={color} strokeWidth={sw} strokeLinecap="round" />
  );
  const arms: Record<Pose, React.ReactNode> = {
    idle: (
      <>
        {L(0, -0.62, -0.16, -0.38)}
        {L(0, -0.62, 0.16, -0.38)}
      </>
    ),
    cross: (
      <>
        {L(-0.17, -0.44, 0.05, -0.58)}
        {L(0.17, -0.44, -0.05, -0.58)}
      </>
    ),
    point: (
      <>
        {L(0, -0.62, -0.15, -0.4)}
        {L(0, -0.62, 0.14, -0.67)}
        {L(0.14, -0.67, 0.05, -0.77)}
      </>
    ),
    talk: (
      <>
        {L(0, -0.62, -0.2, -0.52)}
        {L(0, -0.62, 0.2, -0.72)}
      </>
    ),
    cheer: (
      <>
        {L(0, -0.62, -0.2, -0.86)}
        {L(0, -0.62, 0.2, -0.86)}
      </>
    ),
  };
  const e = easeOut(clamp01(appear));
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: opacity * clamp01(appear * 3) }}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.7 + 0.3 * e})`}>
        <circle cx={0} cy={-0.8 * h} r={0.12 * h} fill={color} />
        {look > 0.02 ? (
          <>
            <circle cx={(-0.04 + lookX * 0.035) * h} cy={-0.81 * h} r={0.022 * h} fill={eye} opacity={look} />
            <circle cx={(0.04 + lookX * 0.035) * h} cy={-0.81 * h} r={0.022 * h} fill={eye} opacity={look} />
          </>
        ) : null}
        {L(0, -0.68, 0, -0.3)}
        {L(0, -0.3, -0.12, 0)}
        {L(0, -0.3, 0.12, 0)}
        {arms[pose]}
      </g>
    </svg>
  );
};

/** Theatre-style mask: face, eye holes, smile, and an optional crack that draws itself. */
export const Mask: React.FC<{ x: number; y: number; s: number; face: string; ink: string; crack: string; crackP?: number; appear?: number; rot?: number }> = ({ x, y, s, face, ink, crack, crackP = 0, appear = 1, rot = 0 }) => {
  const e = easeOut(clamp01(appear));
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: clamp01(appear * 3) }}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * (0.6 + 0.4 * e)})`}>
        <path d="M -60 -70 Q 0 -92 60 -70 Q 74 10 0 84 Q -74 10 -60 -70 Z" fill={face} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -42 -28 Q -26 -44 -10 -26 Q -26 -16 -42 -28 Z" fill={ink} />
        <path d="M 42 -28 Q 26 -44 10 -26 Q 26 -16 42 -28 Z" fill={ink} />
        <path d="M -34 18 Q 0 56 34 18" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
        <path d="M 0 -84 L 10 -44 L -8 -12 L 12 24 L 0 62 L 6 84" pathLength={1} fill="none" stroke={crack} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - clamp01(crackP)} />
      </g>
    </svg>
  );
};

/** A plain face; `mirror` draws a reflected twin across a dashed line ("same"). */
export const Face: React.FC<{ x: number; y: number; r: number; color: string; ink: string; appear?: number; mirror?: boolean; blink?: number }> = ({ x, y, r, color, ink, appear = 1, mirror = false, blink = 0 }) => {
  const t = useT();
  const e = easeOut(clamp01(appear));
  const one = (cx: number, flip: number) => (
    <g transform={`translate(${cx} ${y}) scale(${flip * e}, ${e})`}>
      <circle r={r} fill="none" stroke={color} strokeWidth={r * 0.08} />
      <circle cx={-r * 0.35} cy={-r * 0.12} r={r * 0.09} fill={color} transform={`scale(1 ${1 - blink * Math.max(0, Math.sin(t * 2.2) ** 20)})`} />
      <circle cx={r * 0.35} cy={-r * 0.12} r={r * 0.09} fill={color} />
      <path d={`M ${-r * 0.4} ${r * 0.3} Q 0 ${r * 0.62} ${r * 0.4} ${r * 0.3}`} fill="none" stroke={color} strokeWidth={r * 0.08} strokeLinecap="round" />
      <path d={`M ${-r * 1.5} 0`} />
    </g>
  );
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {one(x, 1)}
      {mirror ? (
        <>
          <line x1={x + r * 1.25} y1={y - r * 1.3} x2={x + r * 1.25} y2={y + r * 1.3} stroke={color} strokeWidth={3} strokeDasharray="10 10" opacity={0.7 * e} />
          {one(x + r * 2.5, -1)}
        </>
      ) : null}
      <circle cx={0} cy={0} r={0} fill={ink} />
    </svg>
  );
};

/** Scribble speech bubble that pops in at t0. */
export const Bubble: React.FC<{ x: number; y: number; s: number; t0: number; color: string }> = ({ x, y, s, t0, color }) => {
  const t = useT();
  const p = easeOut(seg(t, t0, t0 + 0.25));
  if (p <= 0) return null;
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y}) scale(${s * p})`} opacity={p} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
        <ellipse cx={0} cy={0} rx={70} ry={42} />
        <path d="M -20 40 L -34 68 L 6 44" />
        <path d="M -40 -8 L 40 -8" />
        <path d="M -30 12 L 26 12" />
      </g>
    </svg>
  );
};
