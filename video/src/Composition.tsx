import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { validateSpec, type VideoSpec } from "./video-spec";

// Remotion waits for this local font before capturing any frame.
loadFont({
  family: "Noto Naskh Arabic",
  url: staticFile("fonts/NotoNaskhArabic-Regular.ttf"),
  weight: "400",
});

export const TextAnimation: React.FC<VideoSpec> = ({ text, backgroundColor, textColor, direction }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const clamped = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const characters = Array.from(text).filter((character) => !/\p{Mark}/u.test(character)).length;
  const fontSize = Math.min(Math.min(width, height) * 0.52, (width - 200) / Math.max(2, Math.min(characters, 20)) * 1.5);

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 60, border: "1px solid #ffffff16", borderRadius: 48,
      }} />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center", padding: "120px 100px",
        opacity: interpolate(frame, [0, 0.65 * fps, durationInFrames - 0.6 * fps, durationInFrames - 1], [0, 1, 1, 0], clamped),
        translate: `0 ${interpolate(frame, [0, 1.1 * fps], [55, 0], { ...clamped, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
        scale: interpolate(frame, [0, 1.1 * fps], [0.94, 1], clamped),
      }}>
        <div lang={/[\u0600-\u06ff]/u.test(text) ? "ar" : undefined} dir={direction} style={{
          color: textColor, fontFamily: '"Noto Naskh Arabic", "DejaVu Sans", sans-serif',
          fontWeight: 400, fontSize, lineHeight: 1.8, textAlign: "center",
          whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxWidth: "100%",
          // Keep whole words together so Arabic shaping and combining marks survive.
          unicodeBidi: "plaintext",
        }}>{text}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const VideoCompositions = () => (
  <>
    <Composition
      id="ArabicVertical"
      component={TextAnimation}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
      defaultProps={{ text: "ب", format: "vertical", durationSeconds: 5, backgroundColor: "#073b2c", textColor: "#f3e9cf", direction: "rtl" }}
      calculateMetadata={({ props }) => {
        validateSpec(props);
        return { width: props.format === "vertical" ? 1080 : 1920, height: props.format === "vertical" ? 1920 : 1080, durationInFrames: Math.round(props.durationSeconds * 30) };
      }}
    />
    <Composition
      id="ArabicHorizontal"
      component={TextAnimation}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={150}
      defaultProps={{ text: "ب", format: "horizontal", durationSeconds: 5, backgroundColor: "#073b2c", textColor: "#f3e9cf", direction: "rtl" }}
      calculateMetadata={({ props }) => {
        validateSpec(props);
        return { width: props.format === "vertical" ? 1080 : 1920, height: props.format === "vertical" ? 1920 : 1080, durationInFrames: Math.round(props.durationSeconds * 30) };
      }}
    />
  </>
);
