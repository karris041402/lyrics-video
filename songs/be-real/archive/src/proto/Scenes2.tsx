import React from "react";
import { AbsoluteFill, random } from "remotion";
import { lines, Word } from "../lyrics/data";
import { clamp01, easeInOut, easeOut, useOnset, useT } from "../lyrics/motion";
import { Bubble, Face, Mask, Stickman } from "./graphics";
import { BLACK_FONT, BOLD_FONT, CH, CW, Curve, HBlur, Ovals, PW, REG_FONT, SceneSet, wavePath } from "./kit";

const YELLOW = "#ffe14d";
const BLUE = "#1530ff";
const RED = "#e5262b";
const INK = "#0a0a0a";
const PAPER = "#f4f4f0";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const w = (ln: number, i: number): Word => lines[ln - 1].words[i];
const fake = (word: string, start: number, end: number): Word => ({ word, start, end });

/** Fades/moves earlier lyric material away when the next phrase takes over. */
const Ghost: React.FC<{ a: number; b: number; to?: number; dy?: number; dx?: number; s?: number; children: React.ReactNode }> = ({ a, b, to = 0.16, dy = 0, dx = 0, s = 1, children }) => {
  const t = useT();
  const k = easeInOut(seg(t, a, b));
  return <AbsoluteFill style={{ opacity: lerp(1, to, k), transform: `translate(${dx * k}px, ${dy * k}px) scale(${lerp(1, s, k)})` }}>{children}</AbsoluteFill>;
};

/* ---------- S6 (line 7): black, stickmen who stop looking ---------- */
export const SceneNobodyLooking: React.FC = () => {
  const t = useT();
  const xs = [260, 560, 860, 1160, 1460, 1760];
  return (
    <SceneSet
      from={16.35}
      to={19.4}
      bg="#050505"
      wipe={{ kind: "left", start: 16.35, dur: 0.28 }}
      under={<Ovals color="#ffffff" count={9} seed="s6" speed={18} />}
      camera={(ts) => ({ s: 1 + 0.05 * (ts / 3), x: -30 * (ts / 3) })}
    >
      {xs.map((x, i) => {
        const turn = seg(t, 17.18 + i * 0.26, 17.18 + i * 0.26 + 0.35);
        return (
          <Stickman
            key={i}
            x={x}
            y={690}
            h={380}
            color="#ffffff"
            eye="#050505"
            pose={i % 2 ? "cross" : "idle"}
            appear={seg(t, 16.5 + i * 0.07, 16.9 + i * 0.07)}
            look={1 - turn}
            lookX={-turn * 1.6}
          />
        );
      })}
      <PW w={w(7, 0)} x={160} y={90} size={90} font={REG_FONT} color="#fff" dir={-1} />
      <PW w={w(7, 1)} x={160} y={170} size={120} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(7, 2)} x={150} y={730} size={250} color={YELLOW} dir={1} smear={140} extra={{ letterSpacing: `${lerp(-0.02, 0.06, easeOut(seg(t, 17.18, 19.4)))}em` }} />
    </SceneSet>
  );
};

/* ---------- S7 (line 8): yellow, mask cracks, "fake" splits ---------- */
const FakeSplit: React.FC<{ word: Word; x: number; y: number; size: number }> = ({ word, x, y, size }) => {
  const { on, since, t } = useOnset(word);
  if (!on) return null;
  const n = 6;
  const sliceK = clamp01(1 - since / 0.4);
  const sp = easeOut(seg(since, 0.4, 0.75));
  const boxW = size * 2.3;
  const layer = (clip: string, dx: number, dy: number, key: string) => (
    <div key={key} style={{ position: "absolute", inset: 0, fontFamily: BLACK_FONT, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em", color: INK, whiteSpace: "nowrap", clipPath: clip, transform: `translate(${dx}px, ${dy}px)` }}>
      {word.word}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: boxW, height: size * 1.1, transform: `scale(${1 + 0.12 * sliceK})`, transformOrigin: "0 50%" }}>
      {since < 0.4
        ? Array.from({ length: n }, (_, i) => layer(`inset(${(i / n) * 100}% 0 ${(1 - (i + 1) / n) * 100}% 0)`, (random(`fs${i}${Math.floor(t * 30)}`) - 0.5) * 120 * sliceK, 0, `s${i}`))
        : [layer("polygon(0 0, 100% 0, 100% 36%, 0 76%)", -16 * sp, -12 * sp, "a"), layer("polygon(0 76%, 100% 36%, 100% 100%, 0 100%)", 16 * sp, 12 * sp, "b")]}
      <svg width={boxW} height={size * 1.1} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M-30,${size * 1.1 * 0.76} L${boxW * 0.62},${size * 1.1 * 0.36}`} pathLength={1} stroke={RED} strokeWidth={9} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - seg(since, 0.4, 0.7)} />
      </svg>
    </div>
  );
};
export const SceneFake2: React.FC = () => {
  const t = useT();
  return (
    <SceneSet
      from={19.26}
      to={22.07}
      bg={YELLOW}
      wipe={{ kind: "right", start: 19.26, dur: 0.14 }}
      under={<Ovals color={INK} count={10} speed={34} seed="s7" />}
      camera={(ts) => ({ s: 1 + 0.08 * (ts / 2.8), r: lerp(-1, 1.2, ts / 2.8) })}
    >
      <PW w={w(8, 0)} x={160} y={150} size={110} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(8, 1)} x={160} y={260} size={110} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(8, 2)} x={160} y={370} size={110} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(8, 3)} x={560} y={170} size={190} color={INK} dir={-1} smear={140} />
      <Mask x={1640} y={330} s={2.1} face={PAPER} ink={INK} crack={RED} appear={seg(t, 19.88, 20.3)} crackP={seg(t, 20.24, 21.1)} rot={seg(t, 20.24, 21.4) * 8} />
      <FakeSplit word={w(8, 4)} x={470} y={440} size={540} />
    </SceneSet>
  );
};

/* ---------- Verse A1 (lines 9-10): paper, accumulating paragraph that scrolls ---------- */
export const SceneParagraph: React.FC = () => {
  const t = useT();
  const scroll = -330 * easeInOut(seg(t, 25.0, 25.6));
  const old = lerp(1, 0.28, easeInOut(seg(t, 25.0, 25.6)));
  return (
    <SceneSet
      from={21.84}
      to={27.62}
      bg={PAPER}
      wipe={{ kind: "up", start: 21.84, dur: 0.22 }}
      under={<Ovals color={INK} count={8} speed={12} seed="a1" />}
      camera={(ts) => ({ s: 1 + 0.06 * (ts / 5.8) })}
    >
      <Curve d="M-60,1150 L1980,260" progress={seg(t, 22.9, 24.6)} color={BLUE} width={12} opacity={0.9} />
      <AbsoluteFill style={{ transform: `translateY(${scroll}px)` }}>
        <AbsoluteFill style={{ opacity: old }}>
          <PW w={w(9, 0)} x={160} y={120} size={100} font={BOLD_FONT} color={INK} dir={-1} />
          <PW w={w(9, 1)} x={414} y={120} size={100} font={BOLD_FONT} color={INK} dir={-1} />
          <PW w={w(9, 2)} x={556} y={120} size={100} font={BOLD_FONT} color={INK} dir={-1} />
          <PW w={w(9, 3)} x={754} y={120} size={100} font={BOLD_FONT} color={INK} dir={-1} />
          <PW w={w(9, 4)} x={160} y={250} size={190} color={PAPER} stroke={INK} dir={1} smear={110} />
          <PW w={w(9, 5)} x={1010} y={310} size={100} font={BOLD_FONT} color={INK} dir={1} />
          <PW w={w(9, 6)} x={160} y={470} size={230} color={INK} dir={1} smear={140} />
        </AbsoluteFill>
        <PW w={w(10, 0)} x={160} y={720} size={100} font={BOLD_FONT} color={INK} dir={-1} />
        <PW w={w(10, 1)} x={414} y={720} size={100} font={BOLD_FONT} color={INK} dir={-1} />
        <PW w={w(10, 2)} x={160} y={830} size={190} color={BLUE} dir={1} smear={110} />
        <PW w={w(10, 3)} x={1010} y={880} size={100} font={BOLD_FONT} color={INK} dir={1} />
        <PW w={w(10, 4)} x={160} y={1050} size={230} color={INK} dir={1} smear={140} />
      </AbsoluteFill>
    </SceneSet>
  );
};

/* ---------- Verse A2 (lines 11-12): black, talking to yourself, zigzag ---------- */
export const SceneSelfTalk: React.FC = () => {
  const t = useT();
  const point = seg(t, 28.0, 28.4);
  return (
    <SceneSet
      from={27.5}
      to={30.03}
      bg="#050505"
      wipe={{ kind: "diag", start: 27.5, dur: 0.2 }}
      under={<Ovals color="#ffffff" count={10} seed="a2" />}
      camera={(ts) => ({ s: 1 + 0.07 * (ts / 2.5), r: lerp(0, -1.4, ts / 2.5) })}
    >
      <Stickman x={1530} y={1010} h={760} color="#ffffff" eye="#050505" pose={point > 0.5 ? "point" : "talk"} appear={seg(t, 27.6, 28.0)} lookX={0.4} />
      <Bubble x={1330} y={190} s={2} t0={27.98} color="#fff" />
      <Ghost a={28.86} b={29.2} to={0.18} dy={-60}>
        <PW w={w(11, 0)} x={160} y={110} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
        <PW w={w(11, 1)} x={470} y={110} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
        <PW w={w(11, 2)} x={640} y={110} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
        <PW w={w(11, 3)} x={160} y={240} size={300} color={YELLOW} dir={1} smear={150} />
      </Ghost>
      <PW w={w(12, 0)} x={160} y={640} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(12, 1)} x={360} y={700} size={100} font={BOLD_FONT} color="#fff" dir={1} />
      <PW w={w(12, 2)} x={540} y={760} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <Curve d="M-40,900 L260,820 L180,860 L620,780 L520,830 L1000,720 L900,770 L1500,640" progress={seg(t, 29.48, 29.8)} color={RED} width={14} />
      <PW w={w(12, 3)} x={160} y={800} size={200} color="#fff" dir={1} smear={150} />
    </SceneSet>
  );
};

/* ---------- Verse A3 (line 13): red, mask cracks, "peke" ---------- */
export const ScenePeke: React.FC = () => {
  const t = useT();
  const { since, on } = useOnset(w(13, 3));
  const shake = on && since < 0.2 ? (random(`pk${Math.floor(t * 60)}`) - 0.5) * 40 * (1 - since / 0.2) : 0;
  return (
    <SceneSet
      from={30.0}
      to={31.62}
      bg={RED}
      wipe={{ kind: "left", start: 30.0, dur: 0.22 }}
      under={<Ovals color="#ffffff" count={8} seed="a3" speed={40} />}
      camera={(ts) => ({ s: 1 + 0.06 * (ts / 1.6) })}
    >
      <PW w={w(13, 0)} x={160} y={110} size={120} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(13, 1)} x={440} y={110} size={120} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(13, 2)} x={160} y={250} size={200} color="#fff" dir={-1} smear={140} />
      <Mask x={1560} y={300} s={2.3} face={PAPER} ink={INK} crack={RED} appear={seg(t, 30.44, 30.8)} crackP={seg(t, 30.98, 31.3)} rot={-6} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake / 2}px)` }}>
        <PW w={w(13, 3)} x={160} y={480} size={520} color={INK} dir={1} smear={170} />
      </div>
    </SceneSet>
  );
};

/* ---------- Verse A4 (line 14): paper, calm — "maging totoo lang" ---------- */
export const SceneTotooCalm: React.FC = () => {
  const t = useT();
  const key = w(14, 1);
  const fill = easeOut(seg(t, key.start, key.end + 0.3));
  return (
    <SceneSet
      from={31.38}
      to={33.08}
      bg={PAPER}
      wipe={{ kind: "circle", start: 31.38, dur: 0.22, cx: 400, cy: 540 }}
      under={<Ovals color={INK} count={6} speed={10} seed="a4" />}
      camera={(ts) => ({ s: 1 + 0.03 * (ts / 1.7) })}
    >
      <PW w={w(14, 0)} x={170} y={240} size={150} font={REG_FONT} color={INK} dir={-1} />
      <PW w={fake(key.word, key.start, key.end)} x={150} y={400} size={400} color={PAPER} stroke={INK} dir={0} smear={0} />
      <PW w={key} x={150} y={400} size={400} color={BLUE} dir={0} smear={0} extra={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }} />
      <PW w={w(14, 2)} x={1380} y={620} size={140} font={REG_FONT} color={INK} dir={1} />
      <Face x={1560} y={280} r={120} color={INK} ink={INK} appear={seg(t, 31.8, 32.2)} blink={1} />
    </SceneSet>
  );
};

/* ---------- Verse B1 (lines 15-16): blue, 3D flight forward ---------- */
const W3: React.FC<{ w: Word; x: number; y: number; size: number; color: string; from: number; speed: number; font?: string; op?: number }> = ({ w: word, x, y, size, color, from, speed, font = BLACK_FONT, op = 1 }) => {
  const { on, since } = useOnset(word);
  if (!on) return null;
  const e = easeOut(clamp01(since / 0.3));
  const id = `w3b-${word.start}`;
  const z = -speed * (word.start - from) - 800;
  return (
    <>
      <HBlur id={id} std={(1 - e) * 80} />
      <div
        style={{
          position: "absolute",
          left: CW / 2 + x,
          top: CH / 2 + y,
          fontFamily: font,
          fontSize: size,
          lineHeight: 1,
          whiteSpace: "nowrap",
          color,
          letterSpacing: "-0.02em",
          opacity: op * clamp01(since / 0.06 + 0.1),
          transform: `translate3d(${(1 - e) * 240}px, 0, ${z}px)`,
          filter: (1 - e) * 80 > 0.5 ? `url(#${id})` : undefined,
        }}
      >
        {word.word}
      </div>
    </>
  );
};
export const SceneRun: React.FC = () => {
  const t = useT();
  const from = 32.85;
  const speed = 420;
  const dim = lerp(1, 0.12, easeInOut(seg(t, 35.67, 36.0)));
  return (
    <SceneSet from={from} to={38.36} bg={BLUE} wipe={{ kind: "down", start: from, dur: 0.22 }} under={<Ovals color="#ffffff" count={14} speed={60} seed="b1" />}>
      <Curve d={wavePath(-40, 1960, 860, 70, 260, 0)} progress={seg(t, 33.1, 35.6)} color="#ffffff" width={6} opacity={0.5} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${speed * (t - from)}px) rotateY(${Math.sin(t * 0.7) * 6}deg) rotateZ(${Math.sin(t * 0.5) * 3}deg)` }}>
          <W3 w={w(15, 0)} x={-760} y={-330} size={120} color="#fff" from={from} speed={speed} font={BOLD_FONT} op={dim} />
          <W3 w={w(15, 1)} x={-380} y={-250} size={120} color="#fff" from={from} speed={speed} font={BOLD_FONT} op={dim} />
          <W3 w={w(15, 2)} x={-120} y={-330} size={100} color="#fff" from={from} speed={speed} font={BOLD_FONT} op={dim} />
          <W3 w={w(15, 3)} x={120} y={-220} size={120} color="#fff" from={from} speed={speed} font={BOLD_FONT} op={dim} />
          <W3 w={w(15, 4)} x={380} y={-320} size={100} color="#fff" from={from} speed={speed} font={BOLD_FONT} op={dim} />
          <W3 w={w(15, 5)} x={-640} y={-60} size={170} color="#fff" from={from} speed={speed} op={dim} />
          <W3 w={w(15, 6)} x={-200} y={60} size={330} color={YELLOW} from={from} speed={speed} op={dim} />
          <W3 w={w(16, 0)} x={-760} y={-300} size={110} color="#fff" from={from} speed={speed} font={BOLD_FONT} />
          <W3 w={w(16, 1)} x={-480} y={-200} size={200} color="#fff" from={from} speed={speed} />
          <W3 w={w(16, 2)} x={180} y={-300} size={150} color="#fff" from={from} speed={speed} />
          <W3 w={w(16, 3)} x={-560} y={-10} size={300} color={YELLOW} from={from} speed={speed} />
          <W3 w={w(16, 4)} x={300} y={150} size={200} color="#fff" from={from} speed={speed} />
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneSet>
  );
};

/* ---------- Verse B2 (lines 17-18): paper, forward motion then giant "totoo" ---------- */
const Runner: React.FC<{ word: Word; y: number; size: number; color: string; font?: string; outro: number }> = ({ word, y, size, color, font = BLACK_FONT, outro }) => {
  const { on, since, t } = useOnset(word);
  if (!on) return null;
  const e = easeOut(clamp01(since / 0.4));
  const exit = easeInOut(seg(t, outro, outro + 0.25));
  const x = lerp(-700, 160, e) + since * 36 + exit * 1800;
  const std = (1 - e) * 100 + exit * 90;
  const id = `rn-${word.start}`;
  return (
    <>
      <HBlur id={id} std={std} />
      <div style={{ position: "absolute", left: x, top: y, fontFamily: font, fontSize: size, lineHeight: 1, whiteSpace: "nowrap", color, letterSpacing: "-0.02em", filter: std > 0.5 ? `url(#${id})` : undefined }}>
        {word.word}
      </div>
    </>
  );
};
export const SceneForwardTotoo: React.FC = () => {
  const t = useT();
  const key = w(18, 2);
  const fill = easeOut(seg(t, key.start, key.end + 0.6));
  return (
    <SceneSet
      from={38.03}
      to={43.2}
      bg={PAPER}
      wipe={{ kind: "right", start: 38.03, dur: 0.3 }}
      under={<Ovals color={INK} count={8} speed={50} seed="b2" />}
      camera={(ts) => ({ s: 1 + 0.07 * (ts / 5.1) })}
    >
      <Runner word={w(17, 0)} y={70} size={110} color={INK} font={BOLD_FONT} outro={40.6} />
      <Runner word={w(17, 1)} y={190} size={250} color={BLUE} outro={40.6} />
      <Runner word={w(17, 2)} y={470} size={100} color={INK} font={BOLD_FONT} outro={40.6} />
      <Runner word={w(17, 3)} y={570} size={100} color={INK} font={BOLD_FONT} outro={40.6} />
      <Runner word={w(17, 4)} y={660} size={250} color={INK} outro={40.6} />
      <Runner word={w(17, 5)} y={940} size={100} color={INK} font={BOLD_FONT} outro={40.6} />
      <PW w={w(18, 0)} x={160} y={110} size={90} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(18, 1)} x={380} y={110} size={90} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={fake(key.word, key.start, key.end)} x={110} y={250} size={520} color={PAPER} stroke={INK} dir={0} smear={0} />
      <PW w={key} x={110} y={250} size={520} color={BLUE} dir={1} smear={160} extra={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }} />
      {[3, 4, 5, 6, 7].map((i, k) => (
        <PW key={i} w={w(18, i)} x={160 + k * 300} y={870} size={100} font={BOLD_FONT} color={INK} dir={1} />
      ))}
    </SceneSet>
  );
};

/* ---------- Verse C1 (line 19): black, the figure from the reference — arms crossed ---------- */
export const SceneGaniyan: React.FC = () => {
  const t = useT();
  return (
    <SceneSet
      from={43.17}
      to={45.6}
      bg="#050505"
      wipe={{ kind: "left", start: 43.17, dur: 0.04 }}
      under={<Ovals color="#ffffff" count={9} seed="c1" />}
      camera={(ts) => ({ s: 1 + 0.06 * (ts / 2.4) })}
    >
      <Curve d={wavePath(-40, 1960, 540, 100, 220, 1)} progress={seg(t, 43.4, 44.8)} color={BLUE} width={10} />
      <Stickman x={1480} y={1030} h={800} color="#ffffff" eye="#050505" pose="cross" appear={seg(t, 43.42, 43.9)} lookX={0} />
      <PW w={w(19, 0)} x={160} y={120} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(19, 1)} x={160} y={240} size={250} color="#fff" dir={-1} smear={130} />
      <PW w={w(19, 2)} x={160} y={520} size={380} color={YELLOW} dir={1} smear={150} extra={{ letterSpacing: `${lerp(-0.02, 0.05, easeOut(seg(t, 44.1, 44.93)))}em` }} />
      <PW w={w(19, 3)} x={880} y={820} size={130} font={REG_FONT} color="#fff" dir={1} extra={{ fontStyle: "italic" }} />
    </SceneSet>
  );
};

/* ---------- Verse C2 (line 20): blue, a thought is dismissed ---------- */
export const SceneDismiss: React.FC = () => {
  const t = useT();
  const gone = easeInOut(seg(t, 47.42, 47.9));
  return (
    <SceneSet
      from={45.27}
      to={48.1}
      bg={BLUE}
      wipe={{ kind: "left", start: 45.27, dur: 0.28 }}
      under={<Ovals color="#ffffff" count={12} speed={44} seed="c2" />}
      camera={(ts) => ({ s: 1 + 0.05 * (ts / 2.8), r: lerp(1.2, -1, ts / 2.8) })}
    >
      <PW w={w(20, 0)} x={160} y={140} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(20, 1)} x={330} y={200} size={100} font={BOLD_FONT} color="#fff" dir={1} />
      <PW w={w(20, 2)} x={510} y={260} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(20, 3)} x={160} y={380} size={230} color="#fff" dir={-1} smear={130} />
      <PW w={w(20, 4)} x={1000} y={470} size={110} font={BOLD_FONT} color="#fff" dir={1} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - gone, transform: `translateY(${-160 * gone}px)`, filter: `blur(${gone * 14}px)` }}>
        <PW w={w(20, 5)} x={160} y={640} size={230} color={BLUE} stroke="#ffffff" dir={1} smear={130} />
        <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
          <line x1={140} y1={790} x2={140 + 900 * seg(t, 47.0, 47.42)} y2={790} stroke={YELLOW} strokeWidth={12} strokeLinecap="round" />
        </svg>
      </div>
      <PW w={w(20, 6)} x={1000} y={620} size={360} color={YELLOW} dir={1} smear={160} />
      <Stickman x={1620} y={1040} h={420} color="#ffffff" eye={BLUE} pose="cross" appear={seg(t, 45.6, 46.0)} />
    </SceneSet>
  );
};

/* ---------- Verse C3 (line 21): black, the crowd talks, one figure is unmoved ---------- */
export const SceneCrowd: React.FC = () => {
  const t = useT();
  const xs = [190, 420, 650, 1270, 1500, 1730];
  return (
    <SceneSet
      from={48.1}
      to={50.65}
      bg="#050505"
      wipe={{ kind: "left", start: 48.1, dur: 0.08 }}
      under={<Ovals color="#ffffff" count={8} seed="c3" speed={20} />}
      camera={(ts) => ({ x: lerp(0, -60, ts / 2.6), s: 1.04 })}
    >
      {xs.map((x, i) => (
        <React.Fragment key={i}>
          <Stickman x={x} y={1040} h={310} color="#6a6f7d" eye="#050505" pose="talk" appear={seg(t, 48.2 + i * 0.05, 48.6 + i * 0.05)} lookX={x < 960 ? 1 : -1} />
          <Bubble x={x + (x < 960 ? 60 : -60)} y={640 - (i % 2) * 40} s={1.05} t0={48.7 + i * 0.22} color="#8a8f9d" />
        </React.Fragment>
      ))}
      <Stickman x={960} y={1050} h={560} color="#ffffff" eye="#050505" pose="cross" appear={seg(t, 48.4, 48.9)} />
      <PW w={w(21, 0)} x={160} y={90} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(21, 1)} x={400} y={90} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(21, 2)} x={640} y={90} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(21, 3)} x={880} y={90} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(21, 4)} x={1140} y={90} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={w(21, 5)} x={160} y={250} size={290} color={YELLOW} dir={1} smear={150} />
      <PW w={w(21, 6)} x={1640} y={380} size={140} color="#050505" stroke="#ffffff" dir={1} />
    </SceneSet>
  );
};

/* ---------- Verse C4 (line 22): paper, soft contrast ---------- */
export const SceneContrast: React.FC = () => {
  const t = useT();
  return (
    <SceneSet
      from={50.57}
      to={53.2}
      bg={PAPER}
      wipe={{ kind: "right", start: 50.57, dur: 0.16 }}
      under={<Ovals color={INK} count={7} speed={10} seed="c4" />}
      camera={(ts) => ({ s: 1 + 0.04 * (ts / 2.6) })}
    >
      <Curve d={wavePath(-40, 1960, 930, 40, 300, 0)} progress={seg(t, 51.9, 53.0)} color={BLUE} width={10} />
      <PW w={w(22, 0)} x={160} y={110} size={230} color={INK} dir={-1} smear={130} />
      <PW w={w(22, 1)} x={560} y={380} size={230} color={PAPER} stroke={RED} dir={1} smear={130} />
      <PW w={w(22, 2)} x={160} y={440} size={100} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(22, 3)} x={160} y={560} size={100} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(22, 4)} x={160} y={720} size={120} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(22, 5)} x={430} y={690} size={240} color={INK} dir={1} smear={130} />
      <PW w={w(22, 6)} x={1010} y={730} size={120} font={BOLD_FONT} color={INK} dir={1} />
    </SceneSet>
  );
};

/* ---------- Finale (line 23): yellow, the figure turns to face you ---------- */
export const SceneFinale: React.FC = () => {
  const t = useT();
  const ka = w(23, 2);
  const cp = seg(t, ka.start, ka.end + 0.8);
  return (
    <SceneSet
      from={53.08}
      to={99}
      bg={YELLOW}
      wipe={{ kind: "diag", start: 53.08, dur: 0.2 }}
      under={
        <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const k = (t * 0.5 + i / 5) % 1;
            return <circle key={i} cx={CW / 2} cy={CH / 2} r={80 + k * 1100} fill="none" stroke={INK} strokeWidth={6 * (1 - k) + 1} strokeOpacity={0.45 * (1 - k)} />;
          })}
        </svg>
      }
      camera={(ts) => ({ s: 1 + 0.04 * (ts / 4) })}
    >
      <Stickman x={250} y={1040} h={500} color={INK} eye={YELLOW} pose={t >= ka.start ? "cheer" : "idle"} appear={seg(t, 53.4, 53.9)} look={1} lookX={0} />
      <PW w={w(23, 0)} x={160} y={110} size={150} font={BOLD_FONT} color={INK} dir={-1} />
      <PW w={w(23, 1)} x={160} y={250} size={260} color={INK} dir={-1} smear={150} />
      <PW w={ka} x={820} y={330} size={640} color={RED} dir={1} smear={170} extra={{ letterSpacing: `${easeOut(cp) * 0.06}em`, transformOrigin: "0 50%", transform: `scale(${1 + easeOut(cp) * 0.08})` }} />
    </SceneSet>
  );
};
