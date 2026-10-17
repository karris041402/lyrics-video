import React from "react";
import { darken, FONT_HERO } from "./tokens";

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
