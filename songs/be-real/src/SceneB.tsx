import React from "react";
import { AbsoluteFill } from "remotion";
import { lines } from "./data";
import { pulse } from "./beat";
import { clamp01, easeInOut, useT } from "./motion";
import { accentAt, COL_W, COL_X, CH } from "./tokens";
import cat1 from "../assets/cat_meme_agree.jpg";
import cat2 from "../assets/caat_meme_agree2.jpg";
import { MemeCard, Plane, sum, win } from "./kit";

/* =============== S3 — carousel, lines 9-14 (rap-fast: the wheel turns to each line) =============== */

const W_LINES = lines.slice(8, 14);
const STEP = 40;
const R = 1700;

export const S3: React.FC = () => {
  const t = useT();
  const accent = accentAt(t);
  const pl = pulse(t);
  const phi = sum(W_LINES.length, (k) => {
    const s = W_LINES[k].words[0].start;
    return easeInOut(win(t, s - 0.4, s + 0.05));
  });
  return (
    <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: `${(COL_X + COL_W / 2) / 19.2}% 50%` }}>
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 0,
          width: COL_W,
          height: CH,
          transformStyle: "preserve-3d",
          transform: `translateZ(${-R}px) rotateX(${Math.sin(t * 0.6) * 2.5}deg) rotateY(${-phi * STEP + Math.sin(t * 0.8) * 1.5}deg) scale(${1 + 0.004 * pl})`,
        }}
      >
        {W_LINES.map((l, k) => {
          const rel = k - phi;
          const o = clamp01(1.15 - Math.abs(rel) * 0.85);
          if (o <= 0.01) return null;
          return (
            <div key={l.id} style={{ position: "absolute", inset: 0, transform: `rotateY(${k * STEP}deg) translateZ(${R}px)`, opacity: o >= 0.999 ? undefined : o }}>
              <Plane line={l} accent={accent} ghost={0.2} extra={l.index === 14 ? <MemeCard src={cat1} w={l.words[1]} left={900} top={230} size={620} tilt={5} /> : undefined} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* =============== S4 — tunnel, lines 15-18 (momentum: the camera flies through each line) =============== */

const T_LINES = lines.slice(14, 18);
const D = 1300;
const SX = 700;

export const S4: React.FC = () => {
  const t = useT();
  const accent = accentAt(t);
  const pl = pulse(t);
  const c = sum(T_LINES.length, (k) => {
    const s = T_LINES[k].words[0].start;
    return easeInOut(win(t, s - 0.45, s + 0.1));
  });
  const cz = c * D;
  return (
    <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 46%" }}>
      <div
        style={{
          position: "absolute",
          left: -1000,
          top: 520,
          width: 4000,
          height: 4400,
          transformOrigin: "50% 0%",
          transform: "rotateX(80deg)",
          backgroundImage: `linear-gradient(${accent}55 2px, transparent 2px), linear-gradient(90deg, ${accent}33 2px, transparent 2px)`,
          backgroundSize: "150px 150px",
          backgroundPosition: `0 ${cz % 150}px`,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 22%, #000 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 0,
          width: COL_W,
          height: CH,
          transformStyle: "preserve-3d",
          transform: `translate3d(${-c * SX}px, 0, ${cz}px) rotateZ(${Math.sin(t * 0.8) * 1.1}deg) scale(${1 + 0.004 * pl})`,
        }}
      >
        {T_LINES.map((l, k) => {
          const rel = k - c;
          const o = rel < 0 ? clamp01(1 + rel * 2.4) : rel > 1.6 ? 0 : 1;
          if (o <= 0.01) return null;
          return (
            <div key={l.id} style={{ position: "absolute", inset: 0, transform: `translate3d(${k * SX}px, 0, ${-k * D}px)`, opacity: o >= 0.999 ? undefined : o }}>
              <Plane line={l} accent={accent} ghost={0.12} extra={l.index === 18 ? <MemeCard src={cat2} w={l.words[2]} left={900} top={230} size={620} tilt={-5} /> : undefined} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
