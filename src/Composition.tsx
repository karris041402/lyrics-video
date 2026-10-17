import {
  AbsoluteFill,
  Audio,
  Composition,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import aligned from "../public/real_lyrics_aligned.json";
import alignedV2 from "../public/real_lyrics_aligned_v2.json";
import alignedV3 from "../public/real_lyrics_aligned_v3.json";

// Edit public/real_lyrics_aligned.json and save: Studio hot-reloads the timings.
const AUDIO = staticFile(aligned.audio_file);
const FPS = 30;
const DURATION = Math.ceil(aligned.audio_duration_seconds * FPS);

type Word = { word: string; start: number; end: number; confidence?: number | null };
type Line = {
  id: string;
  start: number;
  end: number;
  text: string;
  words: Word[];
  needs_review?: boolean;
};
const makeCheck = (data: { lyrics: unknown }): React.FC => {
  const lines = data.lyrics as Line[];
  return () => <LyricCheck lines={lines} />;
};
const CheckV1 = makeCheck(aligned);
const CheckV2 = makeCheck(alignedV2);
const CheckV3 = makeCheck(alignedV3);

export const MyComposition = () => (
  <>
    <Composition id="LyricCheck" component={CheckV1} durationInFrames={DURATION} fps={FPS} width={1280} height={720} />
    <Composition id="LyricCheckV2" component={CheckV2} durationInFrames={DURATION} fps={FPS} width={1280} height={720} />
    <Composition id="LyricCheckV3" component={CheckV3} durationInFrames={DURATION} fps={FPS} width={1280} height={720} />
  </>
);

const LyricCheck: React.FC<{ lines: Line[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Current line = last line whose start <= t (stays until next starts).
  let idx = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].start <= t) idx = i;
  const line = idx >= 0 ? lines[idx] : null;
  const next = lines[idx + 1];
  const inGap = line ? t > line.end + 0.3 : true;

  return (
    <AbsoluteFill
      style={{
        background: "#0b0b12",
        color: "#fff",
        fontFamily: "sans-serif",
        translate: "-1px 0px"
      }}
    >
      <Audio src={AUDIO} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
        {line && !inGap ? (
          <div style={{ textAlign: "center", fontSize: 68, fontWeight: 800, lineHeight: 1.25 }}>
            {line.words.map((w, i) => {
              const active = t >= w.start && t < w.end;
              const sung = t >= w.end;
              return (
                <span
                  key={i}
                  style={{
                    marginRight: 18,
                    color: active ? "#ffe14d" : sung ? "#ffffff" : "#555a6e",
                    transform: active ? "scale(1.08)" : "none",
                    display: "inline-block",
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        ) : null}
      </AbsoluteFill>

      {next ? (
        <div style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", fontSize: 30, color: "#4b5063" }}>
          next: {next.text}
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 30,
          right: 30,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          fontFamily: "monospace",
          color: line?.needs_review ? "#ff7a7a" : "#8bd48b",
        }}
      >
        <span>
          {line ? line.id : "-"} {line?.needs_review ? "REVIEW" : "ok"}
        </span>
        <span>
          {t.toFixed(2)}s
          {line ? `  [${line.start.toFixed(2)} - ${line.end.toFixed(2)}]` : ""}
        </span>
      </div>
    </AbsoluteFill>
  );
};
