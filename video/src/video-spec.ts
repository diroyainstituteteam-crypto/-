export type VideoSpec = {
  text: string;
  format: "vertical" | "horizontal";
  durationSeconds: number;
  backgroundColor: string;
  textColor: string;
  direction: "rtl" | "ltr" | "auto";
};

export const validateSpec = (spec: VideoSpec): VideoSpec => {
  if (typeof spec.text !== "string" || !spec.text.trim() || spec.text.length > 240) {
    throw new Error("Text must contain 1–240 characters.");
  }
  if (!["vertical", "horizontal"].includes(spec.format)) throw new Error("Invalid format.");
  if (!Number.isFinite(spec.durationSeconds) || spec.durationSeconds < 1 || spec.durationSeconds > 60) {
    throw new Error("Duration must be between 1 and 60 seconds.");
  }
  if (!["rtl", "ltr", "auto"].includes(spec.direction)) throw new Error("Invalid direction.");
  if (![spec.backgroundColor, spec.textColor].every((color) => /^#[0-9a-f]{6}$/i.test(color))) {
    throw new Error("Colors must use #RRGGBB.");
  }
  return spec;
};
