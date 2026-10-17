import { AbsoluteFill, Audio, staticFile } from "remotion";
import { DURATION_S } from "../lyrics/data";
import { clamp01, useT } from "../lyrics/motion";
import { Scene1, Scene2, Scene3, Scene4, Scene5 } from "./Proto";
import {
  SceneContrast,
  SceneCrowd,
  SceneDismiss,
  SceneFake2,
  SceneFinale,
  SceneForwardTotoo,
  SceneGaniyan,
  SceneNobodyLooking,
  SceneParagraph,
  ScenePeke,
  SceneRun,
  SceneSelfTalk,
  SceneTotooCalm,
} from "./Scenes2";

/** Full song, landscape. Scenes stack in order; each wipes in over the previous one. */
export const LyricFull: React.FC = () => {
  const t = useT();
  const fade = clamp01((DURATION_S - t) / 0.8);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("real_IBALsS5z.m4a")} />
      <Scene1 />
      <Scene2 />
      <Scene3 />
      <Scene4 />
      <Scene5 />
      <SceneNobodyLooking />
      <SceneFake2 />
      <SceneParagraph />
      <SceneSelfTalk />
      <ScenePeke />
      <SceneTotooCalm />
      <SceneRun />
      <SceneForwardTotoo />
      <SceneGaniyan />
      <SceneDismiss />
      <SceneCrowd />
      <SceneContrast />
      <SceneFinale />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
