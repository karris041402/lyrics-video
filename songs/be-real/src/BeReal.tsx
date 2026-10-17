import { AbsoluteFill, Audio } from "remotion";
import song from "../assets/real_IBALsS5z.m4a";
import { DURATION_S } from "./data";
import { clamp01, useT } from "./motion";
import { Backdrop, Stage } from "./kit";
import { S1, S2 } from "./SceneA";
import { S3, S4 } from "./SceneB";
import { S5, S6 } from "./SceneC";

/** One conversation with yourself: stage -> chat -> carousel -> tunnel -> notifications -> sent. */
export const BeReal: React.FC = () => {
  const t = useT();
  const fade = Math.min(clamp01(t / 0.5), clamp01((DURATION_S - t) / 0.8));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={song} />
      <Backdrop />
      <Stage inA={0} inB={0.6} outA={11.0} outB={11.8} enter="deep" exit="left">
        <S1 />
      </Stage>
      <Stage inA={10.6} inB={11.5} outA={21.75} outB={22.45} enter="rise" exit="left">
        <S2 />
      </Stage>
      <Stage inA={21.75} inB={22.45} outA={32.85} outB={33.5} enter="right" exit="through">
        <S3 />
      </Stage>
      <Stage inA={32.85} inB={33.5} outA={43.0} outB={43.6} enter="deep" exit="through">
        <S4 />
      </Stage>
      <Stage inA={43.0} inB={43.2} outA={53.2} outB={53.6}>
        <S5 />
      </Stage>
      <Stage inA={53.0} inB={53.28} outA={99} outB={100}>
        <S6 />
      </Stage>
      <AbsoluteFill style={{ background: "#000", opacity: 1 - fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
