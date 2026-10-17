import { Composition } from "remotion";
import { CH, CW } from "../songs/be-real/src/tokens";
import { DURATION_S } from "../songs/be-real/src/data";
import { BeReal } from "../songs/be-real/src/BeReal";

const FPS = 30;

/** One <Composition> per song. Each song lives in songs/<song-name>/ (src, assets, out). */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="BeReal" component={BeReal} durationInFrames={Math.ceil(DURATION_S * FPS)} fps={FPS} width={CW} height={CH} />
    </>
  );
};
