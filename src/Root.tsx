import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { DURATION_S } from "./lyrics/data";
import { LyricVideo } from "./lyrics/LyricVideo";
import { FPS, H, W } from "./lyrics/theme";
import { CH, CW } from "./proto/kit";
import { LyricFull } from "./proto/Full";
import { LyricV2 } from "./v2/LyricV2";
import { LyricV3 } from "./v3/LyricV3";
import { LyricProto, PROTO_END } from "./proto/Proto";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LyricVideo"
        component={LyricVideo}
        durationInFrames={Math.ceil(DURATION_S * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="LyricProto"
        component={LyricProto}
        durationInFrames={Math.ceil(PROTO_END * FPS)}
        fps={FPS}
        width={CW}
        height={CH}
      />
      <Composition
        id="LyricFull"
        component={LyricFull}
        durationInFrames={Math.ceil(DURATION_S * FPS)}
        fps={FPS}
        width={CW}
        height={CH}
      />
      <Composition
        id="LyricV2"
        component={LyricV2}
        durationInFrames={Math.ceil(DURATION_S * FPS)}
        fps={FPS}
        width={CW}
        height={CH}
      />
      <Composition
        id="LyricV3"
        component={LyricV3}
        durationInFrames={Math.ceil(DURATION_S * FPS)}
        fps={FPS}
        width={CW}
        height={CH}
      />
      <MyComposition />
    </>
  );
};
