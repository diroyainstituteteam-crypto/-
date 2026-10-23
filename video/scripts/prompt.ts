import { validateSpec, type VideoSpec } from "../src/video-spec.ts";

/** Offline, deterministic template parser. This is not an AI/LLM integration. */
export function parsePrompt(prompt: string): VideoSpec {
  if (!prompt.trim()) throw new Error("Provide a non-empty prompt.");
  const quoted = prompt.match(/[«“"]([^»”"]+)[»”"]/u)?.[1];
  const letter = prompt.match(/(?:букв[ауы]|letter|حرف)\s*[:：]?\s*([\p{Script=Arabic}\p{Mark}]+)/iu)?.[1];
  const arabic = prompt.match(/[\p{Script=Arabic}\p{Mark}]+/u)?.[0];
  const seconds = prompt.match(/(\d+(?:[.,]\d+)?)\s*(?:сек\w*|seconds?|secs?|s\b|ثوان\S*|ثانية)/iu)?.[1];
  return validateSpec({
    text: quoted ?? letter ?? arabic ?? prompt.trim(),
    format: /горизонт|horizontal|landscape|1920\s*[×x]\s*1080|16\s*:\s*9|أفقي/iu.test(prompt) ? "horizontal" : "vertical",
    durationSeconds: seconds ? Number(seconds.replace(",", ".")) : 5,
    backgroundColor: prompt.match(/#[0-9a-f]{6}\b/iu)?.[0] ?? "#073b2c",
    textColor: "#f3e9cf",
    direction: "auto",
  });
}
