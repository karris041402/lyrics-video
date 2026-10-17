import React from "react";
import { lines } from "../lyrics/data";
import { pulse } from "../lyrics/beat";
import { clamp01, easeOut, useT } from "../lyrics/motion";
import { CH, PHONE_X } from "./tokens";

const PW_ = 430;
const PH_ = 880;
const FONT = '"Segoe UI", "Segoe UI Emoji", Arial, sans-serif';

type Msg = { i: number; text: string; first: number; send: number };
const msgs: Msg[] = lines.map((l, k) => ({
  i: k + 1,
  text: l.words.map((w) => w.word).join(" "),
  first: l.words[0].start,
  send: l.words[l.words.length - 1].end,
}));

/** Reactions / receipts attached to sent lines. Emoji and status only, never new lyrics. */
const REACT: Record<number, string> = { 4: "😮", 8: "👀", 13: "😬", 18: "💯", 22: "🫶", 23: "❤️" };
const SEEN = new Set([3, 7]);
const TYPING: [number, number][] = [[49.2, 50.57]];

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const estH = (text: string) => Math.ceil(text.length / 19) * 34 + 28;

const Dots: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ alignSelf: "flex-start", background: "#2b2d34", borderRadius: 24, padding: "16px 20px", display: "flex", gap: 7 }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ width: 10, height: 10, borderRadius: 10, background: "#9aa0ad", opacity: 0.5 + 0.5 * Math.max(0, Math.sin(t * 7 - i * 0.9)) }} />
    ))}
  </div>
);

export const Phone: React.FC = () => {
  const t = useT();
  const pl = pulse(t);
  const sent = msgs.filter((m) => m.send <= t).slice(-7);
  const cur = msgs.find((m) => t >= m.first && t < m.send);
  const typed = cur ? lines[cur.i - 1].words.filter((w) => w.start <= t).map((w) => w.word).join(" ") : "";
  const last = sent[sent.length - 1];
  const lastK = last ? easeOut(seg(t, last.send, last.send + 0.3)) : 1;
  const shift = last ? estH(last.text) * (1 - lastK) : 0;
  const typing = TYPING.some(([a, b]) => t >= a && t < b);
  const float = Math.sin(t * 0.8) * 6;

  return (
    <div style={{ position: "absolute", left: PHONE_X - PW_ / 2, top: (CH - PH_) / 2, width: PW_, height: PH_, perspective: 1800 }}>
      <div
        style={{
          width: PW_,
          height: PH_,
          borderRadius: 58,
          background: "#07080c",
          border: "7px solid #23252e",
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          transform: `translateY(${float}px) rotateY(-9deg) rotateX(2deg) scale(${1 + 0.004 * pl})`,
          overflow: "hidden",
          fontFamily: FONT,
          color: "#fff",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 14, left: "50%", marginLeft: -52, width: 104, height: 28, borderRadius: 20, background: "#000" }} />
        <div style={{ position: "absolute", top: 54, left: 0, right: 0, height: 76, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderBottom: "1px solid #1c1e26" }}>
          <div style={{ width: 46, height: 46, borderRadius: 46, background: "linear-gradient(135deg,#7aa7ff,#b58cff)" }} />
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Real</div>
            <div style={{ fontSize: 16, color: "#7f8594" }}>
              <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 9, background: "#3ddc84", marginRight: 7 }} />
              Active now
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 134, bottom: 96, left: 0, right: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 18px 8px", gap: 10, WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 70px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, transform: `translateY(${shift}px)` }}>
            {sent.map((m) => {
              const k = easeOut(seg(t, m.send, m.send + 0.25));
              return (
                <div key={m.i} style={{ alignSelf: "flex-end", maxWidth: 310, position: "relative", opacity: k, transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: "100% 100%" }}>
                  <div style={{ background: "linear-gradient(180deg,#2a93ff,#0a63ff)", borderRadius: "24px 24px 6px 24px", padding: "13px 20px", fontSize: 26, lineHeight: "34px" }}>{m.text}</div>
                  {REACT[m.i] && t >= m.send + 0.35 ? (
                    <div style={{ position: "absolute", left: -10, bottom: -16, background: "#1b1d24", border: "2px solid #07080c", borderRadius: 20, padding: "2px 8px", fontSize: 20, transform: `scale(${easeOut(seg(t, m.send + 0.35, m.send + 0.6))})` }}>{REACT[m.i]}</div>
                  ) : null}
                  {SEEN.has(m.i) && t >= m.send + 0.5 && m.i === last?.i ? <div style={{ fontSize: 15, color: "#7f8594", textAlign: "right", marginTop: 4 }}>Seen</div> : null}
                </div>
              );
            })}
            {typing ? <Dots t={t} /> : null}
          </div>
        </div>
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 22, height: 58, borderRadius: 30, background: "#17181f", display: "flex", alignItems: "center", padding: "0 22px", fontSize: 24, color: typed ? "#fff" : "#6b7080", overflow: "hidden", whiteSpace: "nowrap" }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{typed || "Aa"}</span>
          {typed ? <span style={{ width: 2, height: 28, background: "#2a93ff", marginLeft: 4, opacity: Math.sin(t * 9) > 0 ? 1 : 0.2 }} /> : null}
        </div>
      </div>
    </div>
  );
};
