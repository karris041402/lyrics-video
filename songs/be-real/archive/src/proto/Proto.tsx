import React from "react";
import { AbsoluteFill, Audio, random, staticFile } from "remotion";
import { lines, Word } from "../lyrics/data";
import { clamp01, easeInOut, easeOut, useOnset, useT } from "../lyrics/motion";
import { Face } from "./graphics";
import { BLACK_FONT, BOLD_FONT, CH, CW, Curve, HBlur, Ovals, PW, REG_FONT, SceneSet, wavePath } from "./kit";

export const PROTO_END = 15.5;
const [L1, L2, L3, L4, L5, L6] = lines.map((l) => l.words);

const YELLOW = "#ffe14d";
const BLUE = "#1530ff";
const RED = "#e5262b";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/* ---------------- Scene 1: black — "ano man ang marating / lagi lang ako na same" ---------------- */
export const Scene1: React.FC = () => {
  const t = useT();
  const ghost = easeInOut(seg(t, 3.57, 3.95));
  const drift = lerp(0, -60, easeInOut(seg(t, 1.36, 3.57)));
  const grow = 1 + 0.12 * easeInOut(seg(t, 4.4, 6.13));
  const same = L2[4];
  const sameSince = Math.max(0, t - same.start);
  return (
    <SceneSet
      from={0}
      to={6.14}
      bg="#050505"
      under={<Ovals color="#ffffff" count={14} seed="s1" />}
      camera={(ts) => ({ s: 1 + 0.1 * (ts / 6.1), x: -40 * (ts / 6.1), y: -60 * easeInOut(seg(ts, 3.5, 3.95)) })}
    >
      <Curve d={wavePath(-40, 1960, 520, 90, 200, 0.6)} progress={seg(t, 1.2, 3.4)} color={YELLOW} width={8} />
      <AbsoluteFill style={{ opacity: lerp(1, 0.16, ghost), transform: `translateY(${-190 * ghost}px) scale(${lerp(1, 0.85, ghost)})` }}>
        <PW w={L1[0]} x={160} y={130} size={130} font={BOLD_FONT} color="#fff" dir={-1} />
        <PW w={L1[1]} x={420} y={215} size={130} font={BOLD_FONT} color="#fff" dir={1} />
        <PW w={L1[2]} x={700} y={300} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${drift}px)` }}>
          <PW w={L1[3]} x={150} y={330} size={330} color="#fff" dir={1} smear={140} />
        </div>
      </AbsoluteFill>
      <PW w={L2[0]} x={160} y={600} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={L2[1]} x={380} y={680} size={100} font={BOLD_FONT} color="#fff" dir={1} />
      <PW w={L2[2]} x={600} y={760} size={100} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={L2[3]} x={820} y={840} size={100} font={BOLD_FONT} color="#fff" dir={1} />
      {[3, 2, 1].map((k, i) => (
        <PW
          key={i}
          w={{ word: same.word, start: same.start + 0.12 * (i + 1), end: same.end }}
          x={870 + 12 * k}
          y={640 + 12 * k}
          size={330}
          color="#fff"
          stroke="#ffffff"
          dir={0}
          smear={0}
          opacity={0.14 + 0.1 * (2 - i)}
          extra={{ transformOrigin: "0 50%", transform: `scale(${grow})` }}
        />
      ))}
      <PW w={same} x={870} y={640} size={330} color={YELLOW} dir={1} smear={160} extra={{ transformOrigin: "0 50%", transform: `scale(${grow})` }} />
      <div style={{ display: "none" }}>{sameSince}</div>
    </SceneSet>
  );
};

/* ---------------- Scene 2: white — "kung walang nakatingin" ---------------- */
export const Scene2: React.FC = () => {
  const t = useT();
  const key = L3[2];
  const reveal = easeOut(seg(t, key.start, key.start + 0.9));
  const rise = -110 * easeInOut(seg(t, key.start, key.end));
  const pupil = lerp(-50, 50, easeInOut(seg(t, 6.6, 8.8)));
  const eyeIn = easeOut(seg(t, 6.45, 6.9));
  return (
    <SceneSet
      from={5.8}
      to={8.99}
      bg="#f4f4f0"
      wipe={{ kind: "right", start: 5.8, dur: 0.33 }}
      under={<Ovals color="#0a0a0a" count={7} speed={14} seed="s2" />}
      camera={(ts) => ({ r: lerp(-2, 0, seg(ts, 0, 3)), s: 1 + 0.06 * (ts / 3.2) })}
    >
      <PW w={L3[0]} x={160} y={150} size={90} font={REG_FONT} color="#0a0a0a" dir={-1} />
      <PW w={L3[1]} x={160} y={230} size={200} color="#0a0a0a" dir={-1} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={1580} cy={230} r={110 * eyeIn} fill="none" stroke={BLUE} strokeWidth={10} />
        <circle cx={1580 + pupil} cy={230} r={38 * eyeIn} fill={BLUE} />
      </svg>
      <Curve d="M-60,1150 L1980,350" progress={seg(t, 6.7, 8.5)} color={BLUE} width={14} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${rise}px)` }}>
        <PW w={{ word: key.word, start: 7.3, end: key.end }} x={184} y={562} size={250} color="#f4f4f0" stroke={BLUE} dir={0} smear={0} />
        <PW w={key} x={160} y={540} size={250} color="#0a0a0a" dir={1} smear={120} extra={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }} />
      </div>
    </SceneSet>
  );
};

/* ---------------- Scene 3: yellow — "di pa rin magiging fake" ---------------- */
const Fake: React.FC<{ w: Word; x: number; y: number; size: number }> = ({ w, x, y, size }) => {
  const { on, since, t } = useOnset(w);
  if (!on) return null;
  const n = 6;
  const sliceK = clamp01(1 - since / 0.4);
  const sp = easeOut(seg(since, 0.4, 0.75));
  const boxW = size * 2.3;
  const layer = (clip: string, dx: number, dy: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: BLACK_FONT,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        color: "#0a0a0a",
        whiteSpace: "nowrap",
        clipPath: clip,
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    >
      {w.word}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: boxW, height: size * 1.1, transform: `scale(${1 + 0.12 * sliceK})`, transformOrigin: "0 50%" }}>
      {since < 0.4
        ? Array.from({ length: n }, (_, i) =>
            layer(`inset(${(i / n) * 100}% 0 ${(1 - (i + 1) / n) * 100}% 0)`, (random(`fk${i}${Math.floor(t * 30)}`) - 0.5) * 120 * sliceK, 0, `s${i}`),
          )
        : [layer("polygon(0 0, 100% 0, 100% 36%, 0 76%)", -16 * sp, -12 * sp, "a"), layer("polygon(0 76%, 100% 36%, 100% 100%, 0 100%)", 16 * sp, 12 * sp, "b")]}
      <svg width={boxW} height={size * 1.1} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M-30,${size * 1.1 * 0.76} L${boxW * 0.62},${size * 1.1 * 0.36}`} pathLength={1} stroke={RED} strokeWidth={9} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - seg(since, 0.4, 0.7)} />
      </svg>
    </div>
  );
};
export const Scene3: React.FC = () => (
  <SceneSet
    from={8.83}
    to={11.61}
    bg={YELLOW}
    wipe={{ kind: "left", start: 8.83, dur: 0.16 }}
    under={<Ovals color="#0a0a0a" count={10} speed={34} seed="s3" />}
    camera={(ts) => ({ s: 1 + 0.1 * (ts / 2.6), r: lerp(1.5, -1, ts / 2.6) })}
  >
    <PW w={L4[0]} x={160} y={150} size={110} font={BOLD_FONT} color="#0a0a0a" dir={-1} />
    <PW w={L4[1]} x={160} y={260} size={110} font={BOLD_FONT} color="#0a0a0a" dir={-1} />
    <PW w={L4[2]} x={160} y={370} size={110} font={BOLD_FONT} color="#0a0a0a" dir={-1} />
    <PW w={L4[3]} x={560} y={170} size={190} color="#0a0a0a" dir={-1} smear={140} />
    <Fake w={L4[4]} x={470} y={440} size={540} />
  </SceneSet>
);

/* ---------------- Scene 4: black, 3D fly-through — "ano man ang narating" ---------------- */
const Word3D: React.FC<{ w: Word; x: number; y: number; z: number; size: number; font?: string; color: string }> = ({ w, x, y, z, size, font = BLACK_FONT, color }) => {
  const { on, since } = useOnset(w);
  if (!on) return null;
  const e = easeOut(clamp01(since / 0.3));
  const id = `w3-${w.start}`;
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
          opacity: clamp01(since / 0.06 + 0.1),
          transform: `translate3d(${(1 - e) * 240}px, 0, ${z}px)`,
          filter: (1 - e) * 80 > 0.5 ? `url(#${id})` : undefined,
        }}
      >
        {w.word}
      </div>
    </>
  );
};
const SPEED = 560;
export const Scene4: React.FC = () => {
  const t = useT();
  const from = 11.38;
  const zc = SPEED * (t - from);
  const zAt = (w: Word) => -SPEED * (w.start - from) - 800;
  return (
    <SceneSet from={from} to={14.31} bg="#050505" wipe={{ kind: "down", start: 11.38, dur: 0.22 }} under={<Ovals color="#ffffff" count={12} seed="s4" />}>
      <AbsoluteFill style={{ perspective: 1400 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${zc}px) rotateY(${-10 + Math.sin(t * 0.8) * 3}deg) rotateZ(-3deg)` }}>
          <Word3D w={L5[0]} x={-780} y={-400} z={zAt(L5[0])} size={150} font={BOLD_FONT} color="#fff" />
          <Word3D w={L5[1]} x={-250} y={-330} z={zAt(L5[1])} size={150} font={BOLD_FONT} color="#fff" />
          <Word3D w={L5[2]} x={-640} y={-170} z={zAt(L5[2])} size={130} font={BOLD_FONT} color="#fff" />
          <Word3D w={L5[3]} x={-640} y={0} z={zAt(L5[3])} size={290} color={YELLOW} />
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneSet>
  );
};

/* ---------------- Scene 5: blue — "lagi lang ako na same" (opens, cut off at 15.5s) ---------------- */
export const Scene5: React.FC = () => {
  const t = useT();
  const same = L6[4];
  return (
    <SceneSet
      from={14.05}
      to={16.7}
      bg={BLUE}
      wipe={{ kind: "circle", start: 14.05, dur: 0.25, cx: 400, cy: 300 }}
      under={<Ovals color="#ffffff" count={12} seed="s5" />}
      camera={(ts) => ({ s: 1 + 0.05 * ts })}
    >
      <PW w={L6[0]} x={160} y={200} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={L6[1]} x={380} y={290} size={110} font={BOLD_FONT} color="#fff" dir={1} />
      <PW w={L6[2]} x={600} y={380} size={110} font={BOLD_FONT} color="#fff" dir={-1} />
      <PW w={L6[3]} x={820} y={470} size={110} font={BOLD_FONT} color="#fff" dir={1} />
      <PW w={same} x={960} y={580} size={330} color={YELLOW} dir={1} smear={160} />
      <Face x={230} y={820} r={110} color="#fff" ink="#fff" appear={seg(t, 15.0, 15.45)} mirror blink={1} />
    </SceneSet>
  );
};

export const LyricProto: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("real_IBALsS5z.m4a")} />
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Scene5 />
  </AbsoluteFill>
);
