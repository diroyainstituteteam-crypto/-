import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePrompt } from "./prompt.ts";

test("Russian prompt produces the requested Arabic demo", () => {
  const spec = parsePrompt("Вертикальное видео 5 секунд с арабской буквой ب на тёмно-зелёном фоне");
  assert.equal(spec.text, "ب");
  assert.equal(spec.durationSeconds, 5);
  assert.equal(spec.backgroundColor, "#073b2c");
  assert.equal(spec.format, "vertical");
});
test("preserves Arabic diacritics and mixed RTL text exactly", () => {
  const spec = parsePrompt('Horizontal 7 seconds, text "بِسْمِ اللَّهِ 123" #123456');
  assert.equal(spec.text, "بِسْمِ اللَّهِ 123");
  assert.equal(spec.durationSeconds, 7);
  assert.equal(spec.format, "horizontal");
  assert.equal(spec.backgroundColor, "#123456");
});
test("recognizes Arabic format and duration keywords", () => {
  const spec = parsePrompt('أفقي 5 ثوان النص "بَ بِ بُ"');
  assert.equal(spec.format, "horizontal");
  assert.equal(spec.text, "بَ بِ بُ");
});
test("rejects empty prompts and unsafe render durations", () => {
  assert.throws(() => parsePrompt(""));
  assert.throws(() => parsePrompt('"ب" 0 seconds'));
  assert.throws(() => parsePrompt('"ب" 999 seconds'));
});
