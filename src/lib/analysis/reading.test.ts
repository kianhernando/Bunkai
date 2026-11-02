import { describe, it, expect } from "vitest";
import { toHiragana } from "./reading";

describe("toHiragana", () => {
  it("converts katakana to hiragana", () => {
    expect(toHiragana("ワタシ")).toBe("わたし");
  });

  it("keeps the long vowel mark", () => {
    expect(toHiragana("コーヒー")).toBe("こーひー");
  });

  it("leaves hiragana unchanged", () => {
    expect(toHiragana("ひらがな")).toBe("ひらがな");
  });

  it("converts only the katakana in mixed text", () => {
    expect(toHiragana("カタカナとひらがな")).toBe("かたかなとひらがな");
  });
});