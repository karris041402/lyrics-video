import React from "react";
import { Word } from "../lyrics/data";
import { clamp01, easeOut, useOnset } from "../lyrics/motion";
import { darken, FONT_HERO, HERO } from "./tokens";

/** A real extruded word: stacked layers in preserve-3d, so depth shows as it turns. */
export const Extrude: React.FC<{ text: string; size: number; face: string; ry: number; rx: number; z: number; opacity: number; tracking: number; depth?: number }> = ({
  text,
  size,
  face,
  ry,
  rx,
  z,
  opacity,
  tracking,
  depth = 34,
}) => {
  const layers = 16;
  const style: React.CSSProperties = {
    fontFamily: FONT_HERO,
    fontSize: size,
    lineHeight: 1,
    whiteSpace: "nowrap",
    letterSpacing: `${tracking}em`,
  };
  return (
    <div style={{ perspective: 1500, perspectiveOrigin: "30% 50%", opacity }}>
      <div style={{ position: "relative", transformStyle: "preserve-3d", transformOrigin: "0 50%", transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
        {Array.from({ length: layers }, (_, i) => (
          <div key={i} style={{ ...style, position: "absolute", left: 0, top: 0, color: darken(face, 0.45 + (i / layers) * 0.35), transform: `translateZ(${-((i + 1) / layers) * depth}px)` }}>
            {text}
          </div>
        ))}
        <div style={{ ...style, position: "relative", color: face }}>{text}</div>
      </div>
    </div>
  );
};

export const HeroWord: React.FC<{ w: Word; accent: string }> = ({ w, accent }) => {
  const { p, on, t, since, dur } = useOnset(w);
  const sway = Math.sin(t * 1.1 + w.start) * 3;
  const hold = clamp01(since / Math.min(dur, 1.6));
  return (
    <div style={{ visibility: on ? "visible" : "hidden" }}>
      <Extrude
        text={w.word}
        size={HERO}
        face={accent}
        ry={-14 + sway - (1 - p) * 70}
        rx={5}
        z={-(1 - p) * 320}
        opacity={clamp01(p * 3)}
        tracking={-0.02 + 0.03 * easeOut(hold)}
      />
    </div>
  );
};
