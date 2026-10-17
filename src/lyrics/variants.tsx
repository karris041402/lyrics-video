import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { Line, Word } from "./data";
import { clamp01, easeOut, useOnset, useT } from "./motion";
import { DISPLAY, fit, LIGHT, Palette } from "./theme";

export type VariantProps = { line: Line; pal: Palette; o?: Record<string, number | string | boolean> };

/** Shared enter/exit window for a line. Exit = last 0.1s. */
export const LineShell: React.FC<{ line: Line; children: React.ReactNode }> = ({ line, children }) => {
  const t = useT();
  if (t < line.showFrom || t >= line.showTo) return null;
  const out = clamp01((t - (line.showTo - 0.1)) / 0.1);
  return <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.04})` }}>{children}</AbsoluteFill>;
};

const Stage: React.FC<{ children: React.ReactNode; dy?: number }> = ({ children, dy = -60 }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateY(${dy}px)` }}>{children}</AbsoluteFill>
);

const up = (s: string) => s.toUpperCase();

/* ---------- SlamStack: words stacked, each slams in at its onset ---------- */
const SlamWord: React.FC<{ w: Word; size: number; x: number; pal: Palette; dir: number }> = ({ w, size, x, pal, dir }) => {
  const { p, on, active } = useOnset(w);
  if (!on) return <div style={{ height: size * 0.92 }} />;
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: 0.92,
        whiteSpace: "nowrap",
        color: active ? pal.accent : pal.fg,
        opacity: clamp01(p * 3),
        transform: `translate(${x + (1 - p) * 120 * dir}px, ${(1 - p) * 150 * dir}px) scale(${1 + (1 - p) * 0.55})`,
        filter: `blur(${(1 - clamp01(p)) * 14}px)`,
      }}
    >
      {up(w.word)}
    </div>
  );
};
export const SlamStack: React.FC<VariantProps> = ({ line, pal, o }) => {
  const dir = o?.flip ? -1 : 1;
  const rel = line.words.length > 5 ? 0.62 : 1;
  const mult = [1, 0.7, 0.5, 1.15, 0.8, 0.8, 0.9];
  return (
    <Stage>
      {line.words.map((w, i) => {
        const size = fit(w.word, 940, 270 * rel * mult[i % mult.length], 0.82);
        return <SlamWord key={i} w={w} size={size} x={(i % 2 ? 1 : -1) * 36 * dir} pal={pal} dir={dir} />;
      })}
    </Stage>
  );
};

/* ---------- GiantKey: one giant word, the rest small around it ---------- */
const SmallWord: React.FC<{ w: Word; pal: Palette; size: number }> = ({ w, pal, size }) => {
  const { p, on, active } = useOnset(w);
  if (!on) return <span style={{ fontFamily: LIGHT, fontSize: size, letterSpacing: "0.18em", opacity: 0 }}>{up(w.word)}</span>;
  return (
    <span
      style={{
        fontFamily: LIGHT,
        fontSize: size,
        letterSpacing: "0.18em",
        color: active ? pal.accent : pal.fg,
        opacity: clamp01(p * 2),
        transform: `translateY(${(1 - p) * 30}px)`,
        display: "inline-block",
      }}
    >
      {up(w.word)}
    </span>
  );
};
const SmallRow: React.FC<{ words: Word[]; pal: Palette }> = ({ words, pal }) => (
  <div style={{ display: "flex", gap: 26, flexWrap: "wrap", justifyContent: "center", maxWidth: 940, minHeight: words.length ? 70 : 0 }}>
    {words.map((w, i) => (
      <SmallWord key={i} w={w} pal={pal} size={54} />
    ))}
  </div>
);
export const GiantKey: React.FC<VariantProps> = ({ line, pal, o }) => {
  const k = (o?.key as number) ?? line.words.length - 1;
  const style = (o?.style as string) ?? "plain";
  const key = line.words[k];
  const { p, on, t, since, dur } = useOnset(key);
  const size = fit(key.word, 980, 400, 0.8);
  const before = line.words.slice(0, k);
  const after = line.words.slice(k + 1);
  const shake = style === "stamp" && since < 0.18 ? (random(`sh${Math.floor(t * 60)}`) - 0.5) * 26 * (1 - since / 0.18) : 0;
  const fillP = clamp01(since / Math.max(0.35, dur));
  const strike = clamp01((since - 0.12) / 0.3);
  const keyStyle: React.CSSProperties =
    style === "outline" ? { color: "transparent", WebkitTextStroke: `4px ${pal.fg}` } : { color: pal.accent };
  const scale = style === "stamp" ? 1 + (1 - p) * 1.3 : 1 + (1 - p) * 0.35;
  const rot = style === "stamp" ? -5 * p : 0;
  return (
    <Stage>
      <SmallRow words={before} pal={pal} />
      <div style={{ position: "relative", margin: "18px 0", height: size * 0.95, display: "flex", alignItems: "center" }}>
        {on ? (
          <>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: size,
                lineHeight: 1,
                whiteSpace: "nowrap",
                opacity: clamp01(p * 3),
                transform: `translate(${shake}px, ${shake / 2}px) scale(${scale}) rotate(${rot}deg)`,
                filter: `blur(${(1 - clamp01(p)) * 12}px)`,
                ...keyStyle,
              }}
            >
              {up(key.word)}
            </div>
            {style === "outline" ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: DISPLAY,
                  fontSize: size,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  color: pal.accent,
                  clipPath: `inset(0 ${(1 - fillP) * 100}% 0 0)`,
                }}
              >
                {up(key.word)}
              </div>
            ) : null}
            {style === "strike" || o?.strike ? (
              <div style={{ position: "absolute", left: "-3%", top: "52%", height: size * 0.07, width: `${strike * 106}%`, background: pal.fg }} />
            ) : null}
          </>
        ) : null}
      </div>
      <SmallRow words={after} pal={pal} />
    </Stage>
  );
};

/* ---------- Stretch: a sustained word whose tracking opens over its duration ---------- */
export const Stretch: React.FC<VariantProps> = ({ line, pal, o }) => {
  const k = (o?.key as number) ?? line.words.length - 1;
  const key = line.words[k];
  const { p, on, since, dur } = useOnset(key);
  const prog = clamp01(since / dur);
  const size = fit(key.word, 900, 230, 1.0);
  const tilt = o?.tilt ? interpolate(prog, [0, 1], [28, 0]) : 0;
  return (
    <Stage>
      <SmallRow words={line.words.slice(0, k)} pal={pal} />
      <div style={{ perspective: 1200, margin: "26px 0", minHeight: size }}>
        {on ? (
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: size,
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: pal.accent,
              letterSpacing: `${interpolate(easeOut(prog), [0, 1], [-0.02, 0.14])}em`,
              opacity: clamp01(p * 2.5),
              transform: `rotateX(${tilt}deg) scale(${1 + (1 - p) * 0.3})`,
              textAlign: "center",
            }}
          >
            {up(key.word)}
          </div>
        ) : null}
      </div>
      <div style={{ height: 6, width: 800 * prog * (on ? 1 : 0), background: pal.fg, opacity: 0.8 }} />
      <div style={{ height: 24 }} />
      <SmallRow words={line.words.slice(k + 1)} pal={pal} />
    </Stage>
  );
};

/* ---------- OneWordCut: fast passages, one display group at a time ---------- */
type Group = { text: string; start: number; end: number };
const groupWords = (words: Word[], minDur: number) => {
  const groups: Group[] = [];
  let cur: Group | null = null;
  words.forEach((w, i) => {
    const nextStart = words[i + 1] ? words[i + 1].start : w.end;
    if (!cur) cur = { text: w.word, start: w.start, end: nextStart };
    else {
      cur.text += ` ${w.word}`;
      cur.end = nextStart;
    }
    if (cur.end - cur.start >= minDur || i === words.length - 1) {
      groups.push(cur);
      cur = null;
    }
  });
  return groups;
};
const CtxWord: React.FC<{ w: Word; pal: Palette }> = ({ w, pal }) => {
  const { active, sung } = useOnset(w);
  return (
    <span style={{ fontFamily: DISPLAY, fontSize: 42, letterSpacing: "0.06em", color: active ? pal.accent : sung ? pal.fg : pal.dim, margin: "0 12px" }}>
      {up(w.word)}
    </span>
  );
};
export const OneWordCut: React.FC<VariantProps> = ({ line, pal }) => {
  const t = useT();
  const groups = groupWords(line.words, 0.22);
  let gi = 0;
  groups.forEach((g, i) => {
    if (g.start <= t + 1e-6) gi = i;
  });
  const g = groups[gi];
  const since = Math.max(0, t - g.start);
  const size = fit(g.text, 980, 330, 0.82);
  const e = easeOut(clamp01(since / 0.12));
  const flash = since < 0.1;
  return (
    <>
      <Stage dy={-150}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: size,
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: flash ? pal.accent : pal.fg,
            transform: `scale(${1.18 - 0.18 * e})`,
          }}
        >
          {up(g.text)}
        </div>
      </Stage>
      <AbsoluteFill style={{ top: 1230, justifyContent: "flex-start", alignItems: "center" }}>
        <div style={{ maxWidth: 940, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 10px" }}>
          {line.words.map((w, i) => (
            <CtxWord key={i} w={w} pal={pal} />
          ))}
        </div>
      </AbsoluteFill>
    </>
  );
};

/* ---------- Persp3D: words fly out of depth in a perspective stage ---------- */
const rowsOf = (words: Word[], maxChars: number) => {
  const rows: Word[][] = [[]];
  let n = 0;
  words.forEach((w) => {
    if (n + w.word.length > maxChars && rows[rows.length - 1].length) {
      rows.push([]);
      n = 0;
    }
    rows[rows.length - 1].push(w);
    n += w.word.length + 1;
  });
  return rows;
};
const Fly: React.FC<{ w: Word; size: number; pal: Palette; i: number; hot: boolean }> = ({ w, size, pal, i, hot }) => {
  const { p, on, active } = useOnset(w);
  const side = i % 2 ? 1 : -1;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: 1.05,
        margin: "0 0.16em",
        visibility: on ? "visible" : "hidden",
        color: active || hot ? pal.accent : pal.fg,
        opacity: clamp01(p * 2.5),
        transform: `translateZ(${(1 - p) * -900}px) rotateY(${(1 - p) * 55 * side}deg) rotateZ(${(1 - p) * 6 * side}deg)`,
      }}
    >
      {up(w.word)}
    </span>
  );
};
export const Persp3D: React.FC<VariantProps> = ({ line, pal, o }) => {
  const t = useT();
  const rows = rowsOf(line.words, (o?.maxChars as number) ?? 12);
  const em = rows.reduce((m, r) => Math.max(m, r.reduce((a, w) => a + w.word.length * 0.8 + 0.32, 0)), 1);
  const size = Math.min(210, 940 / em);
  const sway = Math.sin((t - line.showFrom) * 1.2) * 5;
  let idx = 0;
  return (
    <Stage>
      <div style={{ perspective: 1300, transformStyle: "preserve-3d" }}>
        <div style={{ transform: `rotateY(${sway}deg)`, transformStyle: "preserve-3d", textAlign: "center" }}>
          {rows.map((r, ri) => (
            <div key={ri} style={{ whiteSpace: "nowrap" }}>
              {r.map((w) => {
                const i = idx++;
                return <Fly key={i} w={w} size={size} pal={pal} i={i} hot={o?.hot === w.word} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

/* ---------- CharReveal: soft lines, letters appear across each word's span ---------- */
const CharWord: React.FC<{ w: Word; size: number; pal: Palette }> = ({ w, size, pal }) => {
  const t = useT();
  const span = Math.min(0.45, Math.max(0.12, w.end - w.start));
  const chars = Array.from(w.word);
  return (
    <span style={{ display: "inline-block", margin: "0 0.5em", whiteSpace: "nowrap" }}>
      {chars.map((c, i) => {
        const at = w.start + (i / chars.length) * span;
        const k = easeOut(clamp01((t - at) / 0.22));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: LIGHT,
              fontWeight: 300,
              fontSize: size,
              letterSpacing: "0.05em",
              color: pal.fg,
              opacity: k,
              transform: `translateY(${(1 - k) * 36}px)`,
              filter: `blur(${(1 - k) * 8}px)`,
            }}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
};
export const CharReveal: React.FC<VariantProps> = ({ line, pal }) => {
  const t = useT();
  const rows = rowsOf(line.words, 14);
  const em = rows.reduce((m, r) => Math.max(m, r.reduce((a, w) => a + w.word.length * 0.68 + 1.0, 0)), 1);
  const size = Math.min(150, 920 / em);
  const first = line.words[0].start;
  const last = line.words[line.words.length - 1].end;
  const prog = clamp01((t - first) / Math.max(0.2, last - first));
  return (
    <Stage>
      {rows.map((r, ri) => (
        <div key={ri} style={{ textAlign: "center", lineHeight: 1.25, whiteSpace: "nowrap" }}>
          {r.map((w, i) => (
            <CharWord key={i} w={w} size={size} pal={pal} />
          ))}
        </div>
      ))}
      <div style={{ marginTop: 40, height: 8, width: 520 * prog, background: pal.accent }} />
    </Stage>
  );
};

/* ---------- Finale: "basta tunay ka" ---------- */
export const Finale: React.FC<VariantProps> = ({ line, pal }) => {
  const [a, b, c] = line.words;
  const A = useOnset(a);
  const B = useOnset(b);
  const C = useOnset(c);
  const cp = clamp01(C.since / (C.dur + 0.6));
  return (
    <Stage dy={-40}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: fit(a.word, 900, 150, 0.82),
          lineHeight: 1,
          color: pal.fg,
          visibility: A.on ? "visible" : "hidden",
          opacity: clamp01(A.p * 3),
          transform: `translateX(${(1 - A.p) * -160}px)`,
        }}
      >
        {up(a.word)}
      </div>
      <div style={{ perspective: 1100 }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: fit(b.word, 1000, 280, 0.82),
            lineHeight: 1,
            color: pal.fg,
            visibility: B.on ? "visible" : "hidden",
            opacity: clamp01(B.p * 3),
            transform: `rotateX(${(1 - B.p) * -80}deg) scale(${1 + (1 - B.p) * 0.9})`,
          }}
        >
          {up(b.word)}
        </div>
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 560,
          lineHeight: 0.95,
          color: pal.accent,
          visibility: C.on ? "visible" : "hidden",
          opacity: clamp01(C.p * 3),
          letterSpacing: `${easeOut(cp) * 0.06}em`,
          transform: `scale(${(1 + (1 - C.p) * 1.2) * (1 + easeOut(cp) * 0.08)})`,
        }}
      >
        {up(c.word.replace(",", ""))}
      </div>
    </Stage>
  );
};
