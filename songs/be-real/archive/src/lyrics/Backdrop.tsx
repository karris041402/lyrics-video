import { AbsoluteFill, random } from "remotion";
import { pulse } from "./beat";
import { Section, sections } from "./data";
import { clamp01, easeInOut, useT } from "./motion";
import { H, W } from "./theme";

const clip = (kind: Section["wipe"], p: number) => {
  switch (kind) {
    case "up":
      return `inset(${(1 - p) * 100}% 0 0 0)`;
    case "left":
      return `inset(0 ${(1 - p) * 100}% 0 0)`;
    case "diag": {
      const x = p * 140;
      return `polygon(0 0, ${x}% 0, ${x - 40}% 100%, 0 100%)`;
    }
    default:
      return p >= 1 ? "inset(0)" : "inset(0 0 100% 0)";
  }
};

const Rings: React.FC<{ s: Section; t: number }> = ({ s, t }) => {
  const pl = pulse(t);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`rotate(${t * 4} ${W / 2} ${H / 2})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={W / 2} cy={H / 2 - 40} r={220 + i * 170} fill="none" stroke={s.fg} strokeOpacity={0.09} strokeWidth={2} />
        ))}
      </g>
      <circle cx={W / 2} cy={H / 2 - 40} r={390 + pl * 34} fill="none" stroke={s.accent} strokeOpacity={0.55 + pl * 0.4} strokeWidth={3 + pl * 5} />
    </svg>
  );
};

const Stripes: React.FC<{ s: Section; t: number }> = ({ s, t }) => {
  const pl = pulse(t);
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 46px, ${s.fg}10 46px 48px)`,
          backgroundPosition: `${t * 20}px 0`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={W * 0.82} cy={H * 0.2} r={150 + pl * 14} fill={s.accent} />
        <circle cx={W * 0.12} cy={H * 0.8} r={260} fill="none" stroke={s.fg} strokeWidth={3} strokeOpacity={0.5} />
      </svg>
    </>
  );
};

const Floor: React.FC<{ s: Section; t: number }> = ({ s, t }) => {
  const pl = pulse(t);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: -W,
          right: -W,
          top: H * 0.52,
          height: H,
          transformOrigin: "50% 0",
          transform: "perspective(900px) rotateX(68deg)",
          backgroundImage: `linear-gradient(${s.accent}55 2px, transparent 2px), linear-gradient(90deg, ${s.accent}55 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${(t * 140) % 120}px`,
          opacity: 0.55 + pl * 0.3,
        }}
      />
      {Array.from({ length: 36 }, (_, i) => {
        const x = random(`px${i}`) * W;
        const y = (random(`py${i}`) * H - t * (20 + random(`ps${i}`) * 50) + H * 4) % H;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 5, height: 5, borderRadius: 5, background: s.fg, opacity: 0.35 }} />;
      })}
    </>
  );
};

const Waves: React.FC<{ s: Section; t: number }> = ({ s, t }) => {
  const pl = pulse(t);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const pts: string[] = [];
        for (let x = 0; x <= W; x += 24) {
          const y = H / 2 + Math.sin(x / 170 + t * 1.4 + i * 0.7) * (90 + i * 22 + pl * 18) + (i - 2.5) * 70;
          pts.push(`${x},${y.toFixed(1)}`);
        }
        return <polyline key={i} points={pts.join(" ")} fill="none" stroke={s.accent} strokeOpacity={0.16 + i * 0.05} strokeWidth={2 + (i === 3 ? 2 : 0)} />;
      })}
    </svg>
  );
};

const Expand: React.FC<{ s: Section; t: number }> = ({ s, t }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const k = ((t * 0.55 + i / 5) % 1);
      return <circle key={i} cx={W / 2} cy={H / 2 - 60} r={80 + k * 900} fill="none" stroke={s.fg} strokeWidth={6 * (1 - k) + 1} strokeOpacity={0.5 * (1 - k)} />;
    })}
  </svg>
);

const Decor: React.FC<{ s: Section; t: number }> = ({ s, t }) => {
  switch (s.id) {
    case "hook":
      return <Rings s={s} t={t} />;
    case "verseA":
      return <Stripes s={s} t={t} />;
    case "verseB":
      return <Floor s={s} t={t} />;
    case "verseC":
      return <Waves s={s} t={t} />;
    default:
      return <Expand s={s} t={t} />;
  }
};

/** Section backgrounds stack; each new one wipes in over the previous. */
export const Backdrop: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      {sections.map((s, i) => {
        const p = i === 0 ? 1 : s.wipeDur === 0 ? (t >= s.wipeStart ? 1 : 0) : easeInOut(clamp01((t - s.wipeStart) / s.wipeDur));
        if (p <= 0) return null;
        return (
          <AbsoluteFill key={s.id} style={{ background: s.bg, clipPath: clip(i === 0 ? "cut" : s.wipe, p) }}>
            <Decor s={s} t={t} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
