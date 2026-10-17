import { AbsoluteFill, Audio, staticFile } from "remotion";
import { pulse } from "../lyrics/beat";
import { DURATION_S, lines } from "../lyrics/data";
import { clamp01, useT } from "../lyrics/motion";
import { LineBlock } from "./Block";
import { Phone } from "./Phone";
import { accentAt, BG } from "./tokens";

const Backdrop: React.FC<{ accent: string }> = ({ accent }) => {
  const t = useT();
  const pl = pulse(t);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at 12% 95%, ${accent}, transparent 70%)`, opacity: 0.12 + 0.03 * pl }} />
      <AbsoluteFill style={{ background: "radial-gradient(800px 600px at 88% 5%, #7b6cff, transparent 70%)", opacity: 0.1 }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 2px)", backgroundSize: "56px 56px" }} />
    </AbsoluteFill>
  );
};

export const LyricV2: React.FC = () => {
  const t = useT();
  const accent = accentAt(t);
  const fade = clamp01((DURATION_S - t) / 0.8);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("real_IBALsS5z.m4a")} />
      <Backdrop accent={accent} />
      {lines.map((l) => (
        <LineBlock key={l.id} line={l} accent={accent} />
      ))}
      <Phone />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
