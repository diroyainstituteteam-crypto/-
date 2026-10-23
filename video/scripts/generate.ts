import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { parsePrompt } from "./prompt.ts";

const args = process.argv.slice(2);
const render = args[0] === "--render";
const prompt = (render ? args.slice(1) : args).join(" ");
try {
  const spec = parsePrompt(prompt);
  mkdirSync("out", { recursive: true });
  const propsFile = resolve("out/prompt.json");
  writeFileSync(propsFile, JSON.stringify(spec, null, 2) + "\n");
  console.log(`Video parameters saved: ${propsFile}\n${JSON.stringify(spec, null, 2)}`);
  if (render) {
    const require = createRequire(import.meta.url);
    const cli = resolve(require.resolve("@remotion/cli/package.json"), "../remotion-cli.js");
    // No shell interpolation: prompt text is always data, never a command.
    const result = spawnSync(process.execPath, [cli, "render", "src/index.ts", spec.format === "vertical" ? "ArabicVertical" : "ArabicHorizontal", "out/generated.mp4", `--props=${propsFile}`, "--codec=h264", "--pixel-format=yuv420p", "--concurrency=2"], { stdio: "inherit" });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
