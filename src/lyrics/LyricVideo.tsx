import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Backdrop } from "./Backdrop";
import { pulse } from "./beat";
import { DURATION_S, lines, sectionOfLine } from "./data";
import { clamp01, useT } from "./motion";
import { CharReveal, Finale, GiantKey, LineShell, OneWordCut, Persp3D, SlamStack, Stretch, VariantProps } from "./variants";

type Cfg = { v: React.FC<VariantProps>; o?: VariantProps["o"] };

/** Scene config: line number -> treatment. Revise one entry to restyle one line. */
export const SCENES: Record<number, Cfg> = {
  1: { v: SlamStack },
  2: { v: GiantKey, o: { key: 4, style: "plain" } },
  3: { v: Stretch, o: { key: 2 } },
  4: { v: GiantKey, o: { key: 4, style: "strike" } },
  5: { v: SlamStack, o: { flip: true } },
  6: { v: GiantKey, o: { key: 4, style: "stamp" } },
  7: { v: Stretch, o: { key: 2, tilt: true } },
  8: { v: GiantKey, o: { key: 4, style: "stamp", strike: true } },
  9: { v: OneWordCut },
  10: { v: Persp3D, o: { maxChars: 13 } },
  11: { v: CharReveal },
  12: { v: OneWordCut },
  13: { v: GiantKey, o: { key: 3, style: "stamp" } },
  14: { v: CharReveal },
  15: { v: OneWordCut },
  16: { v: Persp3D, o: { maxChars: 10, hot: "galingan" } },
  17: { v: SlamStack },
  18: { v: GiantKey, o: { key: 2, style: "outline" } },
  19: { v: Stretch, o: { key: 1 } },
  20: { v: OneWordCut },
  21: { v: Persp3D, o: { maxChars: 10 } },
  22: { v: CharReveal },
  23: { v: Finale },
};

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useT();
  const s = 1 + 0.012 * pulse(t) + 0.03 * (t / DURATION_S);
  return (
    <AbsoluteFill style={{ transform: `scale(${s}) rotate(${Math.sin(t * 0.5) * 0.5}deg) translateY(${Math.sin(t * 0.9) * 8}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const LyricVideo: React.FC = () => {
  const t = useT();
  const fade = clamp01((DURATION_S - t) / 0.8);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("real_IBALsS5z.m4a")} />
      <Backdrop />
      <Camera>
        {lines.map((l) => {
          const c = SCENES[l.index];
          const pal = sectionOfLine(l.index);
          return (
            <LineShell key={l.id} line={l}>
              <c.v line={l} pal={pal} o={c.o} />
            </LineShell>
          );
        })}
      </Camera>
      <AbsoluteFill style={{ background: "#000", opacity: 1 - fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
