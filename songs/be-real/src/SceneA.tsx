import React from "react";
import { AbsoluteFill } from "remotion";
import { lines, Word } from "./data";
import { pulse } from "./beat";
import { clamp01, easeInOut, easeOut, useOnset, useT } from "./motion";
import { accentAt, COL_W, FONT_HERO, HERO, HERO_KEYS, INK } from "./tokens";
import { HeroX, OnlyOn, Plane, sum, UI, UIHERO, win } from "./kit";

/* =============== S1 — open stage, lines 1-4 (centered, so nothing hangs on one side) =============== */

/** "fake" splits into two colour ghosts, then gets struck through. */
const Glitch: React.FC<{ w: Word; children: React.ReactNode }> = ({ w, children }) => {
  const { since, on } = useOnset(w);
  const k = on ? clamp01(1 - since / 0.8) : 0;
  const j = Math.sin(since * 70) * k;
  const flat: React.CSSProperties = { position: "absolute", left: 0, top: 0, fontFamily: FONT_HERO, fontSize: HERO, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: "-0.02em", mixBlendMode: "screen", pointerEvents: "none" };
  return (
    <div style={{ position: "relative" }}>
      {children}
      {k > 0 ? (
        <>
          <div style={{ ...flat, color: "#ff5a6e", opacity: 0.75 * k, transform: `translate(${-22 * k + j * 14}px, ${j * 4}px)` }}>{w.word}</div>
          <div style={{ ...flat, color: "#4ab8ff", opacity: 0.75 * k, transform: `translate(${22 * k - j * 14}px, ${-j * 4}px)` }}>{w.word}</div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: -10, top: "56%", height: 14, width: `${easeOut(win(since, 0.5, 0.9)) * 108}%`, background: INK, borderRadius: 7, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
    </div>
  );
};

const S1Line: React.FC<{ i: number }> = ({ i }) => {
  const t = useT();
  const line = lines[i];
  const accent = accentAt(t);
  if (t < line.showFrom - 0.05 || t >= line.showTo + 0.7) return null;
  const qe = 1 - easeOut(win(t, line.showFrom, line.showFrom + 0.55));
  const qx = i < 3 ? easeInOut(win(t, line.showTo - 0.15, line.showTo + 0.35)) : 0;
  const tf = `translate3d(${qe * 760 - qx * 760}px, ${-qx * 30}px, ${-qe * 520 - qx * 900}px) rotateY(${-qe * 32 + qx * 42}deg)`;
  return (
    <div style={{ position: "absolute", left: 960 - COL_W / 2, top: 0, transformOrigin: "50% 50%", transform: tf, opacity: 1 - qx }}>
      <Plane line={line} accent={accent} center fx={i === 3 ? (w, n) => <Glitch w={w}>{n}</Glitch> : undefined} />
    </div>
  );
};

/** Spotlight that searches, then locks on "nakatingin" (line 3) and flickers out on "fake". */
const Spot: React.FC = () => {
  const t = useT();
  const l3 = lines[2];
  const lock = win(t, l3.words[2].start - 0.2, l3.words[2].start + 0.3);
  const search = (1 - lock) * Math.sin(t * 1.3) * 320;
  const x = 960 + search;
  const flick = t > lines[3].words[4].start ? 0.5 + 0.5 * Math.sin(t * 60) * Math.exp(-(t - lines[3].words[4].start) * 2) : 1;
  const a = (0.07 + 0.16 * lock * (t < lines[3].words[4].start ? 1 : 0.4)) * flick;
  return <AbsoluteFill style={{ background: `radial-gradient(760px 520px at ${x}px 54%, rgba(255,255,255,${a}), transparent 70%)` }} />;
};

export const S1: React.FC = () => {
  const t = useT();
  const pl = pulse(t);
  return (
    <AbsoluteFill>
      <Spot />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 50%" }}>
        <AbsoluteFill style={{ transform: `rotateY(${Math.sin(t * 0.5) * 3}deg) rotateX(${Math.sin(t * 0.37) * 1.5}deg) scale(${1 + 0.006 * pl})`, transformOrigin: "50% 50%" }}>
          {[0, 1, 2, 3].map((i) => (
            <S1Line key={i} i={i} />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =============== S2 — the same words, now a Messenger-style chat on a slanted 3D phone, lines 5-8 =============== */

const PW = 760;
const PH = 1040;
const PTOP = 20;
const SLOT = 280;
const BOTTOM = 905;
const FONT = '"Segoe UI", "Segoe UI Emoji", Arial, sans-serif';
const MS = [4, 5, 6, 7].map((k) => lines[k]);
const REACT: Record<number, string> = { 7: "👀", 8: "😬" };
const GRAD = "linear-gradient(160deg,#1f8bff 0%,#5b5cff 55%,#9a4dff 100%)";

const Avatar: React.FC<{ s: number }> = ({ s }) => <div style={{ width: s, height: s, borderRadius: s, background: "linear-gradient(135deg,#7aa7ff,#b58cff)", flex: "none" }} />;

const BubbleWord: React.FC<{ w: Word }> = ({ w }) => {
  const { since, active } = useOnset(w);
  const k = easeOut(clamp01(since / 0.2));
  return <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: UI, lineHeight: "64px", opacity: k, transform: `translateY(${(1 - k) * 14}px)`, display: "inline-block", color: active ? "#ffe9a8" : "#fff" }}>{w.word}</span>;
};

const Bubble: React.FC<{ k: number; cur: number }> = ({ k, cur }) => {
  const t = useT();
  const line = MS[k];
  const s = line.words[0].start;
  if (t < s - 0.02) return null;
  const hk = HERO_KEYS[line.index][0];
  const e = easeOut(win(t, s, s + 0.32));
  const d = cur - k;
  const yb = BOTTOM - d * SLOT;
  const op = d > 2.4 ? 0 : 1 - Math.max(0, d - 1) * 0.55;
  const end = line.words[line.words.length - 1].end;
  const nextStart = k < MS.length - 1 ? MS[k + 1].words[0].start : 99;
  const isLast = t >= end + 0.4 && t < nextStart;
  const before = line.words.slice(0, hk);
  const after = line.words.slice(hk + 1);
  const row = (ws: Word[]) =>
    ws.length ? (
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {ws.map((w, i) => (
          <OnlyOn key={i} w={w}>
            <BubbleWord w={w} />
          </OnlyOn>
        ))}
      </div>
    ) : null;
  return (
    <div style={{ position: "absolute", right: 34, bottom: PH - yb, opacity: op, transformOrigin: "100% 100%", transform: `scale(${0.6 + 0.4 * e}) translateX(${(1 - e) * 60}px) rotateX(${(1 - e) * 30}deg)` }}>
      <div style={{ background: GRAD, borderRadius: "44px 44px 10px 44px", padding: "20px 34px 24px", maxWidth: 620, color: "#fff", boxShadow: "0 16px 36px rgba(60,80,255,0.35)" }}>
        {row(before)}
        <OnlyOn w={line.words[hk]}>
          <div style={{ margin: "2px 0 0 -2px" }}>
            <HeroX w={line.words[hk]} face="#ffffff" size={UIHERO} depth={18} rest={-10} />
          </div>
        </OnlyOn>
        {row(after)}
      </div>
      {REACT[line.index] && t >= end + 0.25 ? (
        <div style={{ position: "absolute", left: -18, bottom: -26, background: "#242733", border: "3px solid #0b0c12", borderRadius: 28, padding: "4px 12px", fontSize: 36, transform: `scale(${easeOut(win(t, end + 0.25, end + 0.5))})` }}>{REACT[line.index]}</div>
      ) : null}
      {isLast ? (
        <div style={{ position: "absolute", right: 0, bottom: -40, transform: `scale(${easeOut(win(t, end + 0.4, end + 0.65))})` }}>
          <Avatar s={26} />
        </div>
      ) : null}
    </div>
  );
};

const Icon: React.FC<{ d: string; c?: string }> = ({ d, c = "#6aa8ff" }) => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill={c}>
    <path d={d} />
  </svg>
);

const SHELL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: PW, height: PH, borderRadius: 88 };

export const S2: React.FC = () => {
  const t = useT();
  const cur = sum(4, (k) => easeInOut(win(t, MS[k].words[0].start - 0.1, MS[k].words[0].start + 0.45)));
  const ry = -24 + 16 * Math.sin(t * 0.45);
  const rx = 7 + 3 * Math.sin(t * 0.6 + 1);
  const rz = -2 + Math.sin(t * 0.5);
  const push = 1 + 0.05 * win(t, 11.4, 21.7);
  const n = 7;
  return (
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
      <div
        style={{
          position: "absolute",
          left: 960 - PW / 2,
          top: PTOP,
          width: PW,
          height: PH,
          transformStyle: "preserve-3d",
          transform: `translateY(${Math.sin(t * 0.9) * 8}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${push})`,
        }}
      >
        {Array.from({ length: n }, (_, i) => (
          <div key={i} style={{ ...SHELL, background: i % 2 ? "#1c1e27" : "#262833", transform: `translateZ(${-(i + 1) * 7}px)`, boxShadow: i === n - 1 ? "0 70px 140px rgba(0,0,0,0.6)" : undefined }} />
        ))}
        <div style={{ ...SHELL, background: "#0b0c12", border: "9px solid #2a2c38", overflow: "hidden", fontFamily: FONT, color: "#fff" }}>
          <div style={{ position: "absolute", top: 16, left: "50%", marginLeft: -62, width: 124, height: 32, borderRadius: 24, background: "#000", zIndex: 3 }} />
          <div style={{ position: "absolute", top: 60, left: 0, right: 0, height: 96, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", borderBottom: "1px solid #1d2029", background: "#0e1016", zIndex: 2 }}>
            <Icon d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" />
            <Avatar s={58} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>Real</div>
              <div style={{ fontSize: 20, color: "#8a90a0" }}>Active now</div>
            </div>
            <Icon d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
            <Icon d="M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11z" />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 168, textAlign: "center", fontSize: 20, color: "#6f7586", zIndex: 1 }}>Today 9:41 PM</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 118, WebkitMaskImage: "linear-gradient(to bottom, transparent 190px, #000 310px)" }}>
            {MS.map((_, k) => (
              <Bubble key={k} k={k} cur={cur} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 118, background: "#0e1016", display: "flex", alignItems: "center", gap: 18, padding: "0 28px 14px", zIndex: 2 }}>
            <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v4h4v2h-4v4h-2v-4H7v-2h4V7z" />
            <Icon d="M4 5h16v14H4zm2 2v10h12V7zm2 7 2.5-3 2 2.5L14 11l3 4z" />
            <div style={{ flex: 1, height: 62, borderRadius: 32, background: "#1b1e27", display: "flex", alignItems: "center", padding: "0 26px", fontSize: 28, color: "#6f7586" }}>Aa</div>
            <Icon d="M2 21 23 12 2 3v7l15 2-15 2z" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
